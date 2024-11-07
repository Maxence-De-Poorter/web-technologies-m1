export default function PageTitle({children}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex justify-center mt-10">
            <h1 className="text-7xl font-bold mb-4">{children}</h1>
        </div>
    )
}