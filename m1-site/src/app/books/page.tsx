import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

function fetchBooks() {
    //A remplacer par une vrai requete vers le back
    return [
        { id: 1, title: 'Book One', author: 'Author A', publishedDate: '2023' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
        { id: 2, title: 'Book Two', author: 'Author B', publishedDate: '2021' },
    ];
}

export default function BooksPage() {
    const books = fetchBooks();

    return(
        <div>
            <PageTitle>Liste des livres</PageTitle>
            <Breadcrumb links={[
                {href: '/', label: 'Accueil'},
                {href: '/books', label: 'Liste des livres'}
            ]}/>

            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <h2>{book.title}</h2>
                        <p>Auteur : {book.author}</p>
                        <p>Date de publication : {book.publishedDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}