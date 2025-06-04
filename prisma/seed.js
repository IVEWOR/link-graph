// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      title: "VSCode",
      imageUrl:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visualstudiocode.svg",
      linkUrl: "https://code.visualstudio.com/",
      category: "Editor",
    },
    {
      title: "Vim",
      imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vim.svg",
      linkUrl: "https://www.vim.org/",
      category: "Editor",
    },
    {
      title: "JavaScript",
      imageUrl:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg",
      linkUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      category: "Language",
    },
    {
      title: "TypeScript",
      imageUrl:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg",
      linkUrl: "https://www.typescriptlang.org/",
      category: "Language",
    },
    {
      title: "React",
      imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg",
      linkUrl: "https://reactjs.org/",
      category: "Framework",
    },
    {
      title: "Angular",
      imageUrl:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg",
      linkUrl: "https://angular.io/",
      category: "Framework",
    },
    {
      title: "Node.js",
      imageUrl:
        "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/node-dot-js.svg",
      linkUrl: "https://nodejs.org/",
      category: "Runtime",
    },
    {
      title: "Rust",
      imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/rust.svg",
      linkUrl: "https://www.rust-lang.org/",
      category: "Language",
    },
    {
      title: "Python",
      imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/python.svg",
      linkUrl: "https://www.python.org/",
      category: "Language",
    },
    {
      title: "Docker",
      imageUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg",
      linkUrl: "https://www.docker.com/",
      category: "Tool",
    },
    // … add as many as you like …
  ];

  // Use createMany with skipDuplicates, since title is unique
  await prisma.item.createMany({
    data: items,
    skipDuplicates: true,
  });

  console.log("✅ Item table seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
