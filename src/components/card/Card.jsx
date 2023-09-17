/* eslint-disable react/prop-types */
import "./Card.scss";

const Card = ({ title, description, dueDate }) => {
    return (
        <div className="card">
            <div className="wrapper">
                <div className="title">
                    <span>{title}</span>
                </div>
                <div className="desc">
                    <span>{description}</span>
                </div>
                <div className="due">
                    <span>{dueDate}</span>
                </div>
            </div>
        </div>
    )
}

export default Card
