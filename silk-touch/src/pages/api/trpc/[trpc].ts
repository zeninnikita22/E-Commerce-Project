import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "../../../server/trpc";
import { z } from "zod";
// import axios from "axios";
import prisma from "../../../../lib/prisma";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const appRouter = router({
  ///
  /// Fetching items ///
  ///

  getAllItems: publicProcedure.query(async () => {
    const data = await prisma.item.findMany({
      include: {
        images: true,
      },
    });
    return data;
  }),

  getAllCategoriesItems: publicProcedure.query(async () => {
    const data = await prisma.category.findMany({
      include: {
        items: {
          include: {
            images: true, // Include images associated with each item
          },
        },
      },
    });

    // console.log({ serverData: data });
    return data;
  }),

  getAllNewItems: publicProcedure.query(async () => {
    const data = await prisma.item.findMany({
      include: {
        images: true,
      },
      where: {
        new: true,
      },
    });
    return data;
  }),

  ///
  /// Cart operations ///
  ///

  addCartItem: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        cartItemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if item is in the database
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Such item wasn't found in database");
        }

        const cartItemToUpdate = await prisma.cartItem.findUnique({
          where: { id: input.cartItemId },
        });

        if (!cartItemToUpdate) {
          await prisma.cartItem.create({
            data: {
              userId: input.userId,
              item: { connect: { id: input.itemId } },
              quantity: 1,
            },
          });
        } else {
          await prisma.cartItem.update({
            where: {
              id: input.cartItemId,
            },
            data: {
              quantity: cartItemToUpdate.quantity + 1,
            },
          });
        }
        console.log("Item added to cart");
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }),

  decreaseCartItem: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        cartItemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if item is in the database
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Such item wasn't found in database");
        } else {
          // If it is in the database, check if there is such item with such user id in the cartitems
          const cartItemToDecrease = await prisma.cartItem.findUnique({
            where: { id: input.cartItemId },
          });

          // If such cartitem with such user id exists, then depending on quantity either decrease quantity by 1 or delete the item from cart
          if (cartItemToDecrease) {
            if (cartItemToDecrease.quantity > 1) {
              // If quantity > 1, decrement the quantity
              await prisma.cartItem.update({
                where: { id: cartItemToDecrease.id },
                data: { quantity: cartItemToDecrease.quantity - 1 },
              });
            } else {
              // If quantity is 1, remove the cart item
              await prisma.cartItem.update({
                where: { id: cartItemToDecrease.id },
                data: { quantity: 0 }, /// Does it remove on 0?
              });
            }
          }
          console.log("Item deleted from cart");
        }
      } catch (error) {
        console.error("Error deleting item from cart:", error);
      }
    }),

  updateCartItemQuantity: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        quantity: z.number(),
        cartItemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if item is in the database
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Such item wasn't found in database");
        } else {
          // If it is in the database, check if there is such item with such user id in the cartitems
          const cartItemToUpdate = await prisma.cartItem.findUnique({
            where: { id: input.cartItemId },
          });
          if (cartItemToUpdate) {
            await prisma.cartItem.update({
              where: { id: cartItemToUpdate.id },
              data: { quantity: input.quantity },
            });
          } else {
            throw new Error("No such item in a cart");
          }
        }
        console.log("Updated quantity of items in a cart");
      } catch (error) {
        console.error("Error updating quantity of items in a cart:", error);
      }
    }),
  deleteCartItem: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        cartItemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Find the item
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Such item wasn't found in database");
        } else {
          // If it is in the database, check if there is such item with such user id in the cartitems
          const cartItemToDelete = await prisma.cartItem.findUnique({
            where: { id: input.cartItemId },
          });
          if (cartItemToDelete) {
            await prisma.cartItem.delete({
              where: { id: cartItemToDelete.id },
            });
          } else {
            throw new Error("No such item in a cart");
          }
        }

        console.log("Item deleted from cart");
      } catch (error) {
        console.error("Error deleting item from cart:", error);
      }
    }),
  getCartItems: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await prisma.cartItem.findMany({
          where: { userId: input.userId },
          include: {
            item: {
              include: { images: true },
            },
          },
        });
        return result;
        // Create a new cart item and associate it with the user
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }),

  ///
  /// Migrating items from guest to user cart  ///
  ///

  migrateCart: publicProcedure
    .input(
      z.object({
        guestUserId: z.string(),
        authorizedUserId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { guestUserId, authorizedUserId } = input;

      try {
        const updatedCartItems = await prisma.cartItem.updateMany({
          where: {
            userId: guestUserId,
          },
          data: {
            userId: authorizedUserId,
          },
        });

        console.log("Cart items migrated: ", updatedCartItems);
        return updatedCartItems;
      } catch (error) {
        console.error("Error migrating cart items: ", error);
        throw new Error("Failed to migrate cart items.");
      }
    }),

  ///
  /// Favorites operations ///
  ///

  getFavoritesItems: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const result = await prisma.favorites.findMany({
          where: { userId: input.userId },
          include: {
            item: {
              include: {
                images: true, // Include images for each item
              },
            },
          },
        });
        return result;
      } catch (error) {
        console.error("Error finding favorites for a user", error);
      }
    }),

  changeFavorites: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        favoritesId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Find the item
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Item not found");
        }

        // Check if the item is already in the favorites
        const favoritesItem = await prisma.favorites.findUnique({
          where: {
            id: input.favoritesId,
          },
        });

        if (favoritesItem) {
          // If the item already in favorites, delete it
          await prisma.favorites.delete({
            where: { id: input.favoritesId },
          });
        } else {
          // If the item doesn't exist, create a new item in favorites
          await prisma.favorites.create({
            data: {
              userId: input.userId,
              item: { connect: { id: input.itemId } },
            },
          });
        }

        console.log("Item added to favorites");
      } catch (error) {
        console.error("Error adding item to favorites", error);
      }
    }),

  deleteFromFavorites: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        itemId: z.number(),
        favoritesId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Find the item
        const item = await prisma.item.findUnique({
          where: { id: input.itemId },
        });

        if (!item) {
          throw new Error("Item not found");
        }

        // Check if the item is already in the favorites
        const favoritesItem = await prisma.favorites.findUnique({
          where: {
            id: input.favoritesId,
          },
        });

        if (favoritesItem) {
          // If the item already in favorites, delete it
          await prisma.favorites.delete({
            where: { id: input.favoritesId },
          });
        } else {
          // If the item doesn't exist, error!
          throw new Error("Such item is not in the favorites");
        }

        console.log("Item deleted from favorites");
      } catch (error) {
        console.error("Error deleting item from favorites", error);
      }
    }),

  ///
  /// Admin operations ///
  ///

  createItem: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        price: z.number(),
        categoryId: z.number(),
        subcategory: z.string(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.item.create({
          data: {
            title: input.title,
            content: input.content,
            price: input.price,
            categoryId: input.categoryId,
            // subcategory: input.subcategory,
            published: input.published,
          },
        });
      } catch (error) {
        console.error("Error creating an item", error);
      }
    }),

  updateItem: publicProcedure
    .input(
      z.object({
        itemId: z.number(),
        title: z.string(),
        content: z.string(),
        price: z.number(),
        categoryId: z.number(),
        // subcategory: z.string(),
        published: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.item.update({
          where: {
            id: input.itemId,
          },
          data: {
            title: input.title,
            content: input.content,
            price: input.price,
            categoryId: input.categoryId,
            // subcategory: input.subcategory,
            published: input.published,
          },
        });
      } catch (error) {
        console.error("Error updating an item", error);
      }
    }),

  deleteItem: publicProcedure
    .input(
      z.object({
        itemId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.item.delete({
          where: {
            id: input.itemId,
          },
        });
      } catch (error) {
        console.error("Error deleting an item", error);
      }
    }),

  ///
  /// Stripe checkout session requests ///
  ///

  createCheckoutSession: publicProcedure
    .input(
      z.object({
        cartItems: z.array(
          z.object({
            priceIdStrapi: z.string(),
            quantity: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const cartItems = input.cartItems;
      // console.log(cartItems);
      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          line_items: cartItems.map((item) => {
            return {
              price: item.priceIdStrapi,
              quantity: item.quantity,
            };
          }),
          mode: "payment",
          allow_promotion_codes: true,
          success_url: `http://localhost:3000/`,
          cancel_url: `http://localhost:3000/`,
        });
        return session;
        // res.redirect(303, session.url);
      } catch (error) {
        // console.log(error);
        throw new Error("Checkout error!");
      }
    }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
