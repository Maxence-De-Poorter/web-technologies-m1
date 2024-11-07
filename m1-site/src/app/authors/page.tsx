import Breadcrumb from "../../components/Breadcrumb";

export default function AuthorsPage() {
    return (
        <div>
            <Breadcrumb links={[
                {href: '/authors', label: 'Liste des auteurs'}
            ]}/>
            <h1>Liste des auteurs</h1>
        </div>
    )
}