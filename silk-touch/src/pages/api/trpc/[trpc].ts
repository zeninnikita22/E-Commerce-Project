import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "../../../server/trpc";
import { z } from "zod";
// import axios from "axios";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";

const appRouter = router({
  ///
  /// Fetching items ///
  ///

  getAllItems: publicProcedure.query(async () => {
    const data = await prisma.item.findMany();
    return data;
  }),
  // registerUser: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       email: z.string().email(),
  //       password: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     try {
  //       await prisma.user.create({
  //         data: {
  //           name: input.name,
  //           email: input.email,
  //           hashedPassword: input.password,
  //         },
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }),

  ///
  /// User login ///
  ///

  // loginUser: publicProcedure
  //   .input(
  //     z.object({
  //       email: z.string().email(),
  //       password: z.string(),
  //     })
  //   )
  //   .mutation(async ({ input }) => {
  //     const user = await prisma.user.findUnique({
  //       where: { email: input.email },
  //       include: { cartitems: true },
  //     });

  //     if (!user) {
  //       throw new Error("User not found");
  //     }

  //     const passwordMatch = await bcrypt.compare(
  //       input.password,
  //       user.hashedPassword
  //     );

  //     if (passwordMatch) {
  //       return {
  //         isAuthorized: true,
  //         name: user.name,
  //         email: user.email,
  //         id: user.id,
  //         cartItems: user.cartitems,
  //       };
  //     } else {
  //       throw new Error("Invalid password");
  //     }
  //   }),

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

      // try {
      //   // Find the user
      //   console.log(input);
      //   const user = await prisma.user.findUnique({
      //     where: { id: input.userId },
      //     include: { cartitems: true },
      //   });

      //   if (!user) {
      //     throw new Error("User not found");
      //   }

      //   // Find the item
      //   const item = await prisma.item.findUnique({
      //     where: { id: input.itemId },
      //   });

      //   if (!item) {
      //     throw new Error("Item not found");
      //   }

      //   // Check if the item is in the cart
      //   const existingCartItem = user.cartitems.find(
      //     (cartItem) => cartItem.itemId === input.itemId
      //   );

      //   if (existingCartItem) {
      //     if (existingCartItem.quantity > 1) {
      //       // If quantity > 1, decrement the quantity
      //       await prisma.cartItem.update({
      //         where: { id: existingCartItem.id },
      //         data: { quantity: existingCartItem.quantity - 1 },
      //       });
      //     } else {
      //       // If quantity is 1, remove the cart item
      //       await prisma.cartItem.update({
      //         where: { id: existingCartItem.id },
      //         data: { quantity: 0 },
      //       });
      //     }
      //   }

      //   // console.log("Item deleted from cart");
      // } catch (error) {
      //   console.error("Error decreasing number of items in cart:", error);
      // }
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

        // if (cartItem) {
        //   // if (existingCartItem.quantity > 1) {
        //   //   // If quantity > 1, decrement the quantity
        //   //   await prisma.cartItem.update({
        //   //     where: { id: existingCartItem.id },
        //   //     data: { quantity: existingCartItem.quantity - 1 },
        //   //   });
        //   // } else {
        //   //   // If quantity is 1, remove the cart item
        //   //   await prisma.cartItem.delete({
        //   //     where: { id: existingCartItem.id },
        //   //   });
        //   // }
        //   // if (input.quantity === 0) {
        //   //   await prisma.cartItem.delete({
        //   //     where: { id: existingCartItem.id },
        //   //   });
        //   // } else {
        //   await prisma.cartItem.update({
        //     where: { id: existingCartItem.id },
        //     data: { quantity: input.quantity },
        //   });
        //   // }
        // }

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

        // if (!item) {
        //   throw new Error("Item not found");
        // }

        // // Check if the item is in the cart
        // const existingCartItem = user.cartitems.find(
        //   (cartItem) => cartItem.itemId === input.itemId
        // );

        // if (existingCartItem) {
        //   await prisma.cartItem.delete({
        //     where: { id: existingCartItem.id },
        //   });
        // } else {
        //   throw new Error("Cannot delete item");
        // }

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
      // const cartItems = await prisma.user.findUnique({
      //   where: { email: input.email },
      // });
      // return cartItems;
      try {
        const result = await prisma.cartItem.findMany({
          where: { userId: input.userId },
          include: { item: true },
        });
        return result;
        // Create a new cart item and associate it with the user
      } catch (error) {
        console.error("Error adding item to cart:", error);
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
          include: { item: true },
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
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
