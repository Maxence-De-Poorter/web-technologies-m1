"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

type Author = {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
    bookCount: number;
};

export default function AuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [searchName, setSearchName] = useState("");
    const [minBookCount, setMinBookCount] = useState<number | "">("");

    const fetchAuthors = async (name = "", minBooks = "") => {
        try {
            const query = new URLSearchParams();
            if (name) query.append("name", name);
            if (minBooks) query.append("minBooks", minBooks.toString());

            const response = await fetch(`http://localhost:3001/authors?${query.toString()}`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération des auteurs");
                return;
            }
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleApplyFilters = () => {
        fetchAuthors(searchName, minBookCount);
    };

    return (
        <div>
            <PageTitle>Liste des auteurs</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Accueil" },
                { href: "/authors", label: "Liste des auteurs" },
            ]} />

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Filtres</h1>

                    <input
                        type="text"
                        placeholder="Rechercher par nom"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <input
                        type="number"
                        placeholder="Nombre minimum de livres"
                        value={minBookCount}
                        onChange={(e) => setMinBookCount(e.target.value ? parseInt(e.target.value) : "")}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <button
                        onClick={handleApplyFilters}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                    >
                        Appliquer les filtres
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {authors.map((author) => (
                            <Link key={author.id} href={`/authors/${author.id}`}>
                                <div className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100">
                                    <img src={author.photo} alt={`${author.first_name} ${author.last_name}`} className="w-full h-32 object-cover rounded-full mb-4" />
                                    <h2 className="text-lg font-semibold">{author.first_name} {author.last_name}</h2>
                                    <p>Nombre de livres : {author.bookCount}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}