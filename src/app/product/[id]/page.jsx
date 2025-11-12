"use client";

import SingleProducts from "@/components/singleProducts/SingleProducts";
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams(); // ✅ hook component ke andar

  return (
    <div>
      <SingleProducts />
    </div>
  );
};

export default Page;
