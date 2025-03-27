import React from "react";
import { Text } from "@/components/ui/text";

interface UpdateProps {
  version: string;
  date: string;
  description: string;
  list: string[];
}

const UpdateList = [
  {
    version: "v1.0.0",
    date: "2023-05-19",
    description: "Initial release of AyoSnap.",
    list: [
      "Initial release of AyoSnap.",
      "Added basic features such as product listing, cart management, and checkout.",
      "Implemented user authentication and registration system.",
      "Integrated payment gateway for secure transactions."
    ]
  },
  {
    version: "v1.0.0",
    date: "2023-05-19",
    description: "Initial release of AyoSnap.",
    list: [
      "Initial release of AyoSnap.",
      "Added basic features such as product listing, cart management, and checkout.",
      "Implemented user authentication and registration system.",
      "Integrated payment gateway for secure transactions."
    ]
  }
];
const page = () => {
  return (
    <>
      <Text as="h1" className="font-bold text-center mt-20">
        Changelog
      </Text>
      <Text as="p" styleVariant="muted" className="text-center mt-3">
        All the since AyoSnap has been released.
      </Text>
      <div className="mt-10 space-y-6 max-w-xl mx-auto pb-32">
        {UpdateList.map((update: UpdateProps) => (
          <div>
            <Text as="h2" className="text-xl font-bold" styleVariant="muted">
              {update.version} - {update.date}
            </Text>
            <Text as="p" className="text-justify">
              {update.description}
            </Text>
            <ul className="list-disc ml-6">
              {update.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
