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
  // //   greeting: publicProcedure
  // //     // This is the input schema of your procedure
  // //     // 💡 Tip: Try changing this and see type errors on the client straight away
  // //     .input(
  // //       z.object({
  // //         name: z.string().nullish(),
  // //         age: z.number(),
  // //       })
  // //     )
  // //     .query(({ input }) => {
  // //       // This is what you're returning to your client
  // //       return {
  // //         text: `hello ${input?.name ?? "world"}`,
  // //         // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
  // //       };
  // //     }),
  // //   // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  // //   getUser: publicProcedure.query(() => {
  // //     return { id: "1", name: "bob" };
  // //   }),
  // //   getData: publicProcedure
  // //     .input(z.object({ id: z.string() }))
  // //     .query(async ({ input }) => {
  // //       console.log("Input id", input.id);
  // //       const response = await fetch(
  // //         `https://jsonplaceholder.typicode.com/posts/${input.id}`
  // //       );
  // //       const data = await response.json();
  // //       // console.log("Called in server", data);
  // //       return data;
  // //     }),
  // //   getCategories: publicProcedure.query(async () => {
  // //     const response = await fetch("http://localhost:1337/api/categories/");
  // //     const data = await response.json();
  // //     // console.log("Called in server", data);
  // //     return data;
  // //   }),
  // //   addCategory: publicProcedure
  // //     .input(z.object({ name: z.string() }))
  // //     .mutation(async ({ input }) => {
  // //       try {
  // //         console.log({ input });
  // //         const result = await axios.post(
  // //           "http://localhost:1337/api/categories/",
  // //           {
  // //             data: {
  // //               name: input.name,
  // //             },
  // //           }
  // //         );
  // //       } catch (error) {
  // //         console.log(error);
  // //       }
  //       // await axios
  //       //   .post(`http://localhost:1337/api/categories/`, "hui")
  //       //   // .post(`http://localhost:1337/api/categories/`, input.name)
  //       //   .then((response) => response.data);
  //     // }),
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
        // console.log("authentication successful");
      } else {
        throw new Error("Invalid password");
      }
    }),
  addCartItem: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        itemId: z.number(), /// number or string?
      })
    )
    .mutation(async ({ input }) => {
      // const cartItems = await prisma.user.findUnique({
      //   where: { email: input.email },
      // });
      // return cartItems;
      try {
        // Find the user by their ID
        const user = await prisma.user.findUnique({
          where: { id: input.userId },
          include: { cartitems: true },
        });

        if (!user) {
          throw new Error("User not found");
        } else {
          const item = await prisma.item.findUnique({
            where: { id: input.itemId },
          });

          if (!item) {
            throw new Error("Item doesn't exist");
          } else {
            const newItem = await prisma.cartItem.create({
              data: {
                title: item.title,
                content: item.content,
                author: {
                  connect: { id: user.id }, // Connect to the user
                },
              },
            });
            const cartItems = user.cartitems;
            console.log("Item added to cart:", newItem);
            return cartItems;
          }

          // Create a new cart item and associate it with the user
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }),
  deleteCartItem: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        itemId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // const cartItems = await prisma.user.findUnique({
      //   where: { email: input.email },
      // });
      // return cartItems;
      try {
        // Find the user by their ID
        const user = await prisma.user.findUnique({
          where: { id: input.userId },
          include: { cartitems: true },
        });

        if (!user) {
          throw new Error("User not found");
        } else {
          const item = await prisma.cartItem.delete({
            where: { id: input.itemId },
          });

          if (!item) {
            throw new Error("Item doesn't exist");
          } else {
            return user.cartitems;
          }

          // Create a new cart item and associate it with the user
        }
      } catch (error) {
        console.error("Error deleting item from cart:", error);
      }
    }),
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
  //   deleteUser: publicProcedure
  //     .input(z.object({ email: z.string().email() }))
  //     .mutation(async ({ input }) => {
  //       try {
  //         await prisma.user.update({
  //           where: {
  //             email: input.email,
  //           },
  //           data: {
  //             posts: {
  //               deleteMany: {},
  //             },
  //           },
  //         });
  //         await prisma.user.delete({
  //           where: {
  //             email: input.email,
  //           },
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }),
  //   getAllUsers: publicProcedure.query(async () => {
  //     const data = await prisma.user.findMany({ include: { posts: true } });
  //     return data;
  //   }),
  //   addPost: publicProcedure
  //     .input(
  //       z.object({ title: z.string(), content: z.string(), authorId: z.number() })
  //     )
  //     .mutation(async ({ input }) => {
  //       try {
  //         await prisma.post.create({
  //           data: {
  //             title: input.title,
  //             content: input.content,
  //             authorId: input.authorId,
  //           },
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       // await axios
  //       //   .post(`http://localhost:1337/api/categories/`, "hui")
  //       //   // .post(`http://localhost:1337/api/categories/`, input.name)
  //       //   .then((response) => response.data);
  //     }),
  //   // getAllUsersPosts: publicProcedure.query(async () => {
  //   //   const data = await prisma.user.findMany();
  //   //   return data;
  //   // }),
});
// const newCategoryMutation = useMutation({
//   mutationFn: (newCategory) =>
//     axios
//       .post(`http://localhost:1337/api/categories/`, newCategory)
//       .then((response) => response.data),
// });

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
