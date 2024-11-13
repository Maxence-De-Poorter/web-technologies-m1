'use client';

import './App.css';
import PageTitle from "../components/PageTitle";

// HomePage component displaying the main content for the home page
export default function HomePage(){
    return(
        <div>
            {/* Page Title component */}
            <PageTitle>Home</PageTitle>
            <main className="p-2">

                {/* Welcome section */}
                <section className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Welcome to our Book and Author Manager</h1>
                    <p className="text-lg mb-4">
                        This project was created as part of our Master's program. It provides an efficient and intuitive way to manage a library of books and authors.
                    </p>
                    <img
                        src="https://imgs.search.brave.com/JOwFLI-cuVgpkqwaidA1LfT73JIql31UCHzO0dg-Tmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cGhvdG9zLXByZW1p/dW0vYmlibGlvdGhl/cXVlLW51bWVyaXF1/ZS1mdXR1cmlzdGUt/ZXR1ZGlhbnRzLXF1/aS1mb250LXJlY2hl/cmNoZXNfMTMyNDc4/NS03MTk1Ni5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw"
                        alt="Library"
                        className="mx-auto mb-8"
                    />
                </section>

                {/* Features section */}
                <section className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Main Features</h2>
                    <ul className="list-disc list-inside">
                        <li>Add, edit, and delete books</li>
                        <li>Add, edit, and delete authors</li>
                        <li>View details of books and authors</li>
                        <li>Search for books by author</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}