"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

type Author = {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
    bookCount: number;
};

export default function AuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);

    const fetchAuthors = async () => {
        try {
            const response = await fetch("http://localhost:3001/authors");
            if (!response.ok) {
                console.error("Erreur lors de la récupération des auteurs");
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
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {authors.map((author) => (
                            <Link key={author.id} href={`/authors/${author.id}`}>
                                <div className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100">
                                    <img src={author.photo_url} alt={`${author.first_name} ${author.last_name}`} className="w-full h-32 object-cover rounded-full mb-4" />
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