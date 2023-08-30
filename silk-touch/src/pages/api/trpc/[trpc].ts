import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "../../../server/trpc";
import { z } from "zod";
// import axios from "axios";
import prisma from "../../../../lib/prisma";

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
            password: input.password,
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
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (input.password === user.password) {
        return { isAuthorized: true };
        // console.log("authentication successful");
      } else {
        throw new Error("Invalid password");
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
