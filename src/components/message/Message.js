const Message = ({ msg }) => {
        return (
                <div className="message">
                        <div className="alert alert-danger" role="alert">
                                {msg}
                        </div>
                </div>
        );
}

export default Message;