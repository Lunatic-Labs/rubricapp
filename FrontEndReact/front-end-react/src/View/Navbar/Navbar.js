import { Link, useMatch, useResolvedPath } from "react-router-dom";
import books from "../../images/books.png";
import user from "../../images/user.png";
import form from "../../images/form.png";
//import AdminAddUser from "../Admin/AddUsers";
// import AdminAddUser from "../Admin/AddUsers/AdminAddUser";
//import AdminViewUsers from './View/Admin/ViewUsers/AdminViewUsers';
// import AdminViewUsers from '../Admin/ViewUsers/AdminViewUsers';
// import Users from '../Admin/ViewUsers/AdminViewUsers';
//import AssessmentTask from './View/AssessmentTask/AssessmentTask';
// import AssessmentTask from '../Admin/ViewAssessmentTask/AssessmentTask';

export default function Navbar() {
    return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Skill Builder
      </Link>
      <ul>
        <CustomLink to="Rubric">Rubric<img style={{width: "20px", height:"20px", margin: "5px"}} src={books}></img></CustomLink>
        <CustomLink to="Courses">Courses<img style={{width: "20px", height:"20px", margin: "5px"}} src={form}></img></CustomLink>
        <CustomLink to="Users">Users<img style={{width: "20px", height:"20px", margin: "5px"}} src={user}></img></CustomLink>
        <CustomLink to="Teams">Teams<img style={{width: "20px", height:"20px", margin: "5px"}} src={books}></img></CustomLink>
      </ul>
      <img style={{width: "20px", height:"20px", margin: "5px"}} src={books}></img>
    </nav>
  )
}

function CustomLink({ to, children, ...props}){
    const path = window.location.pathname
    //const isActive =
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true})
    return(
    <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
            {children}
            </Link>
    </li>
    )
}