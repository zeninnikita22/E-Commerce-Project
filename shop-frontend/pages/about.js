import { useQuery, useQueryClient } from "@tanstack/react-query";

function About() {
  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch("http://localhost:1337/api/categories/")
        .then((response) => response.json())
        .then(({ data }) => {
          return data;
          // console.log(data);
        }),
  });

  console.log(categoryQuery);

  return <div>Temporary page for requests</div>;
}

export default About;
