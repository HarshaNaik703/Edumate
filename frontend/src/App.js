import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Index from './components/Index';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

// Create a context for authentication
export const AuthContext = React.createContext();

function App() {
    const [user, setUser] = useState(null); // Store logged-in user (null if not logged in)

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/logout" render={() => {
                        setUser(null); // Clear user on logout
                        return <Redirect to="/login" />;
                    }} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
