import { db } from './index';
import { users, authors, categories, tags, books, bookTags } from './schema';
import { AuthService } from '../modules/auth/auth.service';
import dotenv from 'dotenv';

dotenv.config();

async function clearDatabase() {
    try {
        console.log('🧹 Clearing existing data...');
        
        await db.delete(bookTags);
        await db.delete(books);
        await db.delete(tags);
        await db.delete(categories);
        await db.delete(authors);
        await db.delete(users);
        
        console.log('✅ Database cleared');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    }
}

async function seed() {
    try {
        console.log('🌱 Seeding database...');
        
        await clearDatabase();

        const authService = new AuthService();

        const usersData = [
            {
                username: 'admin',
                email: 'admin@books.com',
                password: 'admin123',
                fullName: 'Admin User',
                phoneNumber: '+1234567890',
            },
            {
                username: 'janedoe',
                email: 'jane@example.com',
                password: 'password123',
                fullName: 'Jane Doe',
                phoneNumber: '+0987654321',
            },
        ];

        const usersResult = [];
        for (const userData of usersData) {
            const registeredUser = await authService.register(userData);
            usersResult.push(registeredUser.user);
        }

        const user1 = usersResult[0];
        const user2 = usersResult[1];

        console.log('✅ Users created');

        const categoriesResult = await db
            .insert(categories)
            .values([
                { name: 'Fiction', description: 'Fictional stories and novels' },
                { name: 'Non-Fiction', description: 'Real-world topics and facts' },
                { name: 'Science', description: 'Scientific books and research' },
                { name: 'Technology', description: 'Technology and programming books' },
                { name: 'History', description: 'Historical books and biographies' },
            ])
            .returning();

        const fiction = categoriesResult[0];
        const nonFiction = categoriesResult[1];
        const science = categoriesResult[2];
        const tech = categoriesResult[3];
        const history = categoriesResult[4];

        console.log('✅ Categories created');

        const authorsResult = await db
            .insert(authors)
            .values([
                { name: 'J.K. Rowling', bio: 'British author, best known for Harry Potter series' },
                { name: 'Isaac Asimov', bio: 'American author and professor of biochemistry' },
                { name: 'Stephen Hawking', bio: 'English theoretical physicist and cosmologist' },
                { name: 'Robert C. Martin', bio: 'American software engineer and author' },
            ])
            .returning();

        const author1 = authorsResult[0];
        const author2 = authorsResult[1];
        const author3 = authorsResult[2];
        const author4 = authorsResult[3];

        console.log('✅ Authors created');

        const tagsResult = await db
            .insert(tags)
            .values([
                { name: 'Adventure' },
                { name: 'Fantasy' },
                { name: 'Sci-Fi' },
                { name: 'Educational' },
                { name: 'Programming' },
            ])
            .returning();

        const adventure = tagsResult[0];
        const fantasy = tagsResult[1];
        const sciFi = tagsResult[2];
        const educational = tagsResult[3];
        const programming = tagsResult[4];

        console.log('✅ Tags created');

        const booksResult = await db
            .insert(books)
            .values([
                {
                    title: "Harry Potter and the Philosopher's Stone",
                    description: 'The first book in the Harry Potter series',
                    price: '19.99',
                    thumbnail: 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=400&h=600&fit=crop',
                    authorId: author1.id,
                    categoryId: fiction.id,
                    userId: user1.id,
                },
                {
                    title: 'Foundation',
                    description: 'First book in the Foundation series',
                    price: '14.99',
                    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
                    authorId: author2.id,
                    categoryId: fiction.id,
                    userId: user1.id,
                },
                {
                    title: 'A Brief History of Time',
                    description: 'From the Big Bang to Black Holes',
                    price: '24.99',
                    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
                    authorId: author3.id,
                    categoryId: science.id,
                    userId: user2.id,
                },
                {
                    title: 'Clean Code',
                    description: 'A Handbook of Agile Software Craftsmanship',
                    price: '39.99',
                    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
                    authorId: author4.id,
                    categoryId: tech.id,
                    userId: user2.id,
                },
                {
                    title: 'The Clean Coder',
                    description: 'A Code of Conduct for Professional Programmers',
                    price: '34.99',
                    thumbnail: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop',
                    authorId: author4.id,
                    categoryId: tech.id,
                    userId: user1.id,
                },
                {
                    title: 'I, Robot',
                    description: 'A collection of nine science fiction short stories',
                    price: '16.99',
                    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
                    authorId: author2.id,
                    categoryId: fiction.id,
                    userId: user2.id,
                },
            ])
            .returning();

        const book1 = booksResult[0];
        const book2 = booksResult[1];
        const book3 = booksResult[2];
        const book4 = booksResult[3];
        const book5 = booksResult[4];
        const book6 = booksResult[5];

        console.log('✅ Books created');

        await db.insert(bookTags).values([
            { bookId: book1.id, tagId: adventure.id },
            { bookId: book1.id, tagId: fantasy.id },
            { bookId: book2.id, tagId: sciFi.id },
            { bookId: book3.id, tagId: educational.id },
            { bookId: book4.id, tagId: programming.id },
            { bookId: book4.id, tagId: educational.id },
            { bookId: book5.id, tagId: programming.id },
            { bookId: book6.id, tagId: sciFi.id },
        ]);

        console.log('✅ Book tags created');

        console.log('🎉 Seeding completed successfully!');
        console.log('\n📝 Sample credentials:');
        console.log('User 1: john@example.com / password123');
        console.log('User 2: jane@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
