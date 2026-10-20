const EmptyState = ({
    title = "No data available",
    message = "There is nothing to display here."
}) => {
    return (
        <div className="empty-state">
            <h2>{title}</h2>
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;