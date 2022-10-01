import react, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, RedirectFunction, Navigate } from 'react-router-dom';
import { selectUser, fetchUser, fetchUsers, inUser, UserType } from '../store/slices/users';
import { AppDispatch } from '../store/index';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUser());
    }, []);

    const navigate = useNavigate();

    const loginbuttonHandler = () => {
        const trylogin = {email: email, password: password, logged_in: false};
        const exist = userState.users.find(( user : UserType) => {
            return (user.email === trylogin.email && user.password === trylogin.password);
        });

        if(exist !== undefined) {
            let newUser = {...exist, logged_in: true};
            console.log(newUser);
            dispatch(inUser(newUser));
            navigate('/articles');
        }
        else{
            alert("Login failed: email or password is incorrect");
        }
    };
    
    return(
        <div className='Login'>
        {(userState.loginFlag) ? (<Navigate to = '/articles'></Navigate>) : (
            <div className='Login-page'>
                <div className = "email-input">
                    <input id = "email-input" type = "email" onChange = {(e) => setEmail(e.target.value)}></input>
                </div>
                <div className = "pw-input">
                   <input id = "pw-input" type = "pw" onChange = {(e) => setPassword(e.target.value)}></input>
                </div>
                <button id = "login-button" onClick = {() => loginbuttonHandler()}>login</button>
            </div>
        )}
        </div>
    );
}