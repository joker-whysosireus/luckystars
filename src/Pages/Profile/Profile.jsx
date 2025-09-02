import Menu from "../Menus/Menu/Menu";
import "./Profile.css";

function Profile({ userData, updateUserData }) {

    return(
        <section className="profile-page">
            <div className="cards-container">
                {/* Первые три карточки - синие */}
                <div className="card blue-card"></div>
                <div className="card blue-card"></div>
                <div className="card blue-card"></div>
                {/* Первые три карточки - синие */}
                <div className="card blue-card"></div>
                <div className="card blue-card"></div>
                <div className="card blue-card"></div>
                
                {/* Вторые три карточки - фиолетовые */}
                <div className="card purple-card"></div>
                <div className="card purple-card"></div>
                <div className="card purple-card"></div>
                
                {/* Третьи три карточки - зеленые */}
                <div className="card green-card"></div>
                <div className="card green-card"></div>
                <div className="card green-card"></div>
            </div>
            <Menu />
        </section>
    );
}

export default Profile;