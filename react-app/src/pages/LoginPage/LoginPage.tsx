import { Link } from "react-router-dom";

function LoginPage() {
    return(
        <div>
            <Link to="/login/user">
                user
            </Link>
            <Link to="/login/admin">
                admin
            </Link>
        </div>
        
    )
}

export default LoginPage