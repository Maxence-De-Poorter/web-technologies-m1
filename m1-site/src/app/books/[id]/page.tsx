"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from "../../../components/Breadcrumb";
import PageTitle from "../../../components/PageTitle";

// Type definitions for Author and Book
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

// Props interface for the BookDetailsPage component
interface BookDetailsPageProps {
    params: { id: string };
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
    const [book, setBook] = useState<Book | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedYearPublished, setEditedYearPublished] = useState<number | "">("");
    const [editedPrice, setEditedPrice] = useState<number | "">("");
    const router = useRouter();

    // Fetch book details on component mount or when the book ID changes
    useEffect(() => {
        if (params.id) {
            fetchBookDetails(params.id);
        }
    }, [params.id]);

    // Function to fetch book details by ID
    const fetchBookDetails = async (bookId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/books/${bookId}`);
            if (!response.ok) {
                console.error("Error fetching the book details");
                return;
            }
            const data = await response.json();
            setBook(data);
            setEditedTitle(data.title);
            setEditedYearPublished(data.year_published);
            setEditedPrice(data.price);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Modal open/close functions for delete and edit actions
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    // Function to handle book deletion
    const handleDeleteBook = async () => {
        if (book) {
            try {
                const response = await fetch(`http://localhost:3001/books/${book.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Error deleting the book");
                    return;
                }
                router.push("/books");
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    // Function to handle book update
    const handleEditBook = async () => {
        if (book) {
            try {
                const response = await fetch(`http://localhost:3001/books/${book.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: editedTitle,
                        year_published: editedYearPublished,
                        price: editedPrice
                    }),
                });
                if (!response.ok) {
                    console.error("Error updating the book");
                    return;
                }
                closeEditModal();
                fetchBookDetails(book.id.toString());
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    // Render loading message if book details are not yet available
    if (!book) return <p>Loading...</p>;

    return (
        <div>
            <PageTitle>Book Details</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Home" },
                { href: "/books", label: "Books List" },
                { href: `/books/${book.id}`, label: book.title }
            ]} />

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[185px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Options</h1>
                    <button
                        onClick={openEditModal}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                    >
                        Edit this Book
                    </button>
                    <button
                        onClick={openDeleteModal}
                        className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
                    >
                        Delete this Book
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="border p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">{book.title}</h2>
                        <p>Author: {book.author ? (
                            <Link href={`/authors/${book.author.id}`} className="text-blue-500 hover:underline">
                                {book.author.first_name} {book.author.last_name}
                            </Link>
                        ) : "Unknown Author"}</p>
                        <p>Publication Year: {book.year_published}</p>
                        <p>Price: {book.price}$</p>
                    </div>
                </main>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete the book "{book.title}"?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeDeleteModal}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteBook}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit book modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Publication Year"
                            value={editedYearPublished}
                            onChange={(e) => setEditedYearPublished(Number(e.target.value))}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeEditModal}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditBook}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}