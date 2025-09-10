import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '9780743273565',
      publicationYear: 1925,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '9780061120084',
      publicationYear: 1960,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '9780451524935',
      publicationYear: 1949,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '9780141439518',
      publicationYear: 1813,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '9780316769488',
      publicationYear: 1951,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      isbn: '9780544003415',
      publicationYear: 1954,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      author: 'J.K. Rowling',
      isbn: '9780747532699',
      publicationYear: 1997,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '9780547928227',
      publicationYear: 1937,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      isbn: '9781451673319',
      publicationYear: 1953,
      coverImage: 'https://placehold.co/600x400',
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      isbn: '9780060850524',
      publicationYear: 1932,
      coverImage: 'https://placehold.co/600x400',
    },
  ];

  console.log('Start seeding books...');

  await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  console.log(`Seeded ${books.length} books successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
