const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                <span className="bolt-underline">{title}</span>
            </h1>
            {subtitle && (
                <p className="text-gray-500 mt-4">{subtitle}</p>
            )}
        </div>
    );
};

export default PageHeader;
