import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "../../../server/trpc";
import { z } from "zod";
// import axios from "axios";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const appRouter = router({
  getAllItems: publicProcedure.query(async () => {
    const data = await prisma.item.findMany();
    return data;
  }),
  registerUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            hashedPassword: input.password,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        include: { cartitems: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const passwordMatch = await bcrypt.compare(
        input.password,
        user.hashedPassword
      );

      if (passwordMatch) {
        return {
          isAuthorized: true,
          name: user.name,
          email: user.email,
          id: user.id,
          cartItems: user.cartitems,
        };
      } else {
        throw new Error("Invalid password");
      }
    }),
  addCartItem: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        itemId: z.number(),
      })
    )
    .mutation(
      async ({ input }) => {
        try {
          // Find the user
          const user = await prisma.user.findUnique({
            where: { id: input.userId },
            include: { cartitems: true },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Find the item
          const item = await prisma.item.findUnique({
            where: { id: input.itemId },
          });

          if (!item) {
            throw new Error("Item not found");
          }

          // Check if the item is already in the cart
          const existingCartItem = user.cartitems.find(
            (cartItem) => cartItem.itemId === input.itemId
          );

          if (existingCartItem) {
            // If the item already exists, increment its quantity
            await prisma.cartItem.update({
              where: { id: existingCartItem.id },
              data: { quantity: existingCartItem.quantity + 1 },
            });
          } else {
            // If the item doesn't exist, create a new cart item
            await prisma.cartItem.create({
              data: {
                title: item.title,
                content: item.content,
                price: item.price,
                published: item.published,
                author: { connect: { id: input.userId } },
                item: { connect: { id: input.itemId } },
                quantity: 1,
              },
            });
          }

          console.log("Item added to cart");
        } catch (error) {
          console.error("Error adding item to cart:", error);
        }
      }
      // try {
      //   // Find the user by their ID
      //   console.log(input);
      //   const user = await prisma.user.findUnique({
      //     where: { id: input.userId },
      //     include: { cartitems: true },
      //   });

      //   if (!user) {
      //     throw new Error("User not found");
      //   } else {
      //     const item = await prisma.item.findUnique({
      //       where: { id: input.itemId },
      //     });

      //     if (!item) {
      //       throw new Error("Item doesn't exist");
      //     } else {
      //       const cartItem = await prisma.cartItem.findUnique({
      //         where: { itemId: input.itemId, authorId: input.userId },
      //       });
      //       if (!cartItem) {
      //         const newItem = await prisma.cartItem.create({
      //           data: {
      //             title: item.title,
      //             content: item.content,
      //             price: item.price,
      //             author: {
      //               connect: { id: user.id }, // Connect to the user
      //             },
      //             item: { connect: { id: item.id } },
      //           },
      //         });
      //         const cartItems = user.cartitems;
      //         console.log("Item added to cart:", newItem);
      //         return cartItems;
      //       } else {
      //         const updatedCartItem = await prisma.cartItem.update({
      //           where: { authorId: input.userId, itemId: input.itemId },
      //           data: {
      //             quantity:
      //           }
      //         });
      //       }
      //     }

      //     // Create a new cart item and associate it with the user
      //   }
      // } catch (error) {
      //   console.error("Error adding item to cart:", error);
      // }
    ),
  deleteCartItem: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        itemId: z.number(),
      })
    )
    .mutation(
      async ({ input }) => {
        try {
          // Find the user
          console.log(input);
          const user = await prisma.user.findUnique({
            where: { id: input.userId },
            include: { cartitems: true },
          });

          if (!user) {
            throw new Error("User not found");
          }

          // Find the item
          const item = await prisma.item.findUnique({
            where: { id: input.itemId },
          });

          if (!item) {
            throw new Error("Item not found");
          }

          // Check if the item is in the cart
          const existingCartItem = user.cartitems.find(
            (cartItem) => cartItem.itemId === input.itemId
          );

          if (existingCartItem) {
            if (existingCartItem.quantity > 1) {
              // If quantity > 1, decrement the quantity
              await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity - 1 },
              });
            } else {
              // If quantity is 1, remove the cart item
              await prisma.cartItem.delete({
                where: { id: existingCartItem.id },
              });
            }
          }

          console.log("Item deleted from cart");
        } catch (error) {
          console.error("Error deleting item from cart:", error);
        }
      }
      // try {
      //   // Find the user by their ID
      //   const user = await prisma.user.findUnique({
      //     where: { id: input.userId },
      //     include: { cartitems: true },
      //   });

      //   if (!user) {
      //     throw new Error("User not found");
      //   } else {
      //     const item = await prisma.cartItem.delete({
      //       where: { id: input.itemId },
      //     });

      //     if (!item) {
      //       throw new Error("Item doesn't exist");
      //     } else {
      //       return user.cartitems;
      //     }

      //     // Create a new cart item and associate it with the user
      //   }
      // } catch (error) {
      //   console.error("Error deleting item from cart:", error);
      // }
    ),
  getCartItems: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      // const cartItems = await prisma.user.findUnique({
      //   where: { email: input.email },
      // });
      // return cartItems;
      try {
        const result = await prisma.cartItem.findMany({
          where: { authorId: input.userId },
        });
        return result;
        // Create a new cart item and associate it with the user
      } catch (error) {
        console.error("Error adding item to cart:", error);
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
