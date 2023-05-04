import {Route, Router} from 'react-router-dom';
import CreatePoll from './CreatePoll';
import UpdatePoll from './UpdatePoll';
import DeletePoll from './DeletePoll';

const ManagePolls = () => {
    return (
        <div>
            <Router>
                <Route exact path="/manage-polls/create">
                    <CreatePoll />
                </Route>
                <Route exact path="/manage-polls/:token/update">
                    <UpdatePoll />
                </Route>
                <Route exact path="/manage-polls/:token/delete">
                    <DeletePoll />
                </Route>
            </Router>
        </div>
    );
};

export default ManagePolls;
