export default function PageTitle({children}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <h1>{children}</h1>
        </div>
    )
}