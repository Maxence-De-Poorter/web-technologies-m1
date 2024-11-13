"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

// Define types for Author and Book
type Author = {
    id: number;
    first_name: string;
    last_name: string;
};

type Book = {
    id: number;
    title: string;
    year_published: number;
    price: number;
    author?: Author;
};

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBook, setNewBook] = useState({ title: "", year_published: "", price: "", author_id: "" });
    const [errorMessage, setErrorMessage] = useState(""); // State for error message

    // Fetches books based on search criteria
    const fetchBooks = async (title = "", authorId = "", order = "DESC") => {
        try {
            const query = new URLSearchParams();
            if (title) query.append("title", title);
            if (authorId) query.append("author_id", authorId);
            query.append("order", order);

            const response = await fetch(`http://localhost:3001/books?${query.toString()}`);
            if (!response.ok) {
                console.error("Error fetching books");
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Fetches authors for the selection dropdown
    const fetchAuthors = async () => {
        try {
            const response = await fetch("http://localhost:3001/authors");
            if (!response.ok) {
                console.error("Error fetching authors");
            }
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Handles creating a new book entry
    const handleCreateBook = async () => {
        try {
            // Convert string values to correct types
            const bookData = {
                title: newBook.title,
                year_published: parseInt(newBook.year_published, 10),
                price: parseFloat(newBook.price),
                author_id: newBook.author_id
            };

            const response = await fetch("http://localhost:3001/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookData),
            });

            if (!response.ok) {
                setErrorMessage("An error occurred. Please check the fields and try again."); // Set error message
            } else {
                setIsModalOpen(false);
                setNewBook({ title: "", year_published: "", price: "", author_id: "" });
                setErrorMessage(""); // Clear any previous error
                await fetchBooks(); // Refresh book list
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred. Please check the fields and try again."); // Set error message on catch
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, []);

    // Apply filters to book list
    const handleApplyFilters = () => {
        fetchBooks(searchTitle, selectedAuthor, sortOrder);
    };

    return (
        <div>
            <PageTitle>Book List</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Home" },
                { href: "/books", label: "Book List" },
            ]} />

            {/* Modal for creating a new book */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Create a New Book</h2>

                        <input
                            type="text"
                            placeholder="Title"
                            value={newBook.title}
                            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Publication Year"
                            value={newBook.year_published}
                            onChange={(e) => setNewBook({ ...newBook, year_published: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={newBook.price}
                            onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <select
                            value={newBook.author_id}
                            onChange={(e) => setNewBook({ ...newBook, author_id: e.target.value })}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="">Select an Author</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.last_name} {author.first_name}
                                </option>
                            ))}
                        </select>
                        {/* Display error message if there's an error */}
                        {errorMessage && (
                            <div className="text-red-500 mb-4">
                                {errorMessage}
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBook}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Book List */}
            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[350px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Filters</h1>

                    <input
                        type="text"
                        placeholder="Search by Title"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded bg-white text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Authors</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.last_name} {author.first_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded bg-white text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="DESC">Newest to Oldest</option>
                        <option value="ASC">Oldest to Newest</option>
                    </select>

                    <button
                        onClick={handleApplyFilters}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                    >
                        Apply Filters
                    </button>

                    {/* Button to open modal to add new book */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add New Book
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {books.map((book) => (
                            <Link key={book.id} href={`/books/${book.id}`}>
                                <div className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100">
                                    <h2 className="text-lg font-semibold">{book.title}</h2>
                                    <p>Author: {book.author ? `${book.author.first_name} ${book.author.last_name}` : "Unknown Author"}</p>
                                    <p>Publication Year: {book.year_published}</p>
                                    <p>Price: {book.price}$</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}