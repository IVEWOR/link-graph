"use client";
import Image from "next/image";
import Link from "next/link";

export default function StackItemCard({ item }) {
  return (
    <Link
      href={`/dashboard/edit/${item.id}`}
      className="border rounded-lg p-3 flex flex-col items-center gap-2 hover:shadow"
    >
      <Image src={item.image_url} alt={item.titledd} width={64} height={64} />
      <span className="font-medium text-center">{item.title}</span>
      <span className="text-xs text-slate-500">{item.category}</span>
    </Link>
  );
}
