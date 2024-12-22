import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Login/Login';
import SignupForm from '../pages/signup/Signupp';
import QuizTable from './QuizTable';
import ViewQuiz from '../pages/Dashboard/ViewQuiz/ViewQuiz';
import Viewupdate from '../pages/Dashboard/updateQuiz/Viewupdate';
import Quizresult from '../pages/canspace/Result/Quizresult';
import SendQuiz from './SendQuiz';
import UserDashboard from '../pages/Dashboard/UserDashboard';
import Searchh from '../pages/canspace/Community/Searchh';
import Assignments from '../pages/canspace/Assignements/Assignments';
import Quiztest from '../pages/canspace/Testcandidat/Quiztest';
import QuizResult from '../pages/Dashboard/Results/QuizResult';

import RhDashboard from '../pages/Dashboard/rhDash/RhDashboard';
import { Create, Description } from '@material-ui/icons';
import CreateQuiz from '../pages/Dashboard/CreateQuiz/CreateQuiz';
import Userslist from '../pages/Dashboard/Community/Userslist';

import ViewProfile from '../pages/Dashboard/Community/ViewProfile';
import ViewMyProfilee from '../pages/canspace/Community/ViewMyProfilee';
import ViewProfilee from '../pages/canspace/Community/ViewProfilee';
import Friends from '../pages/Dashboard/Community/Friends';
import Friendss from '../pages/canspace/Community/Friendss';
import Search from '../pages/Dashboard/Community/Search';
import Assig from '../pages/Dashboard/HRAssignment/Assig';
import CreateAssign from '../pages/Dashboard/HRAssignment/CreateAssign';
import ViewMyProfile from '../pages/Dashboard/Community/ViewMyProfile';
import EditProfile from './EditProfile';
import Setting from '../pages/Dashboard/Settings/Setting';
import Cpass from '../pages/Dashboard/Settings/Cpass';
import Cpasss from '../pages/canspace/Settings/Cpasss';
import Descriptiontest from '../pages/canspace/Testcandidat/descriptiontest';
import CanDashboard from '../pages/canspace/CanDashboard';
import Userslistt from '../pages/canspace/Community/Userslistt';
import Settingg from '../pages/canspace/Settings/Settingg';
import EditProfilee from './EditProfilee';
import Request from '../pages/canspace/Community/Request';
import Results from "../pages/Dashboard/Results/Results";
import Resultt from "../pages/Dashboard/Results/QuizResultt";
import QuizResultt from '../pages/Dashboard/Results/QuizResultt';
import ResultCan from '../pages/canspace/Result/ResultCan';
import Trainyourself from '../pages/canspace/Train/Trainyourself';
import Quiztestt from '../pages/canspace/Testcandidat/Quiztestt';
import Quizresulttest from '../pages/canspace/Result/Quizresulttest';
import Dash from '../pages/Dashboard/Dash/Dash';
import Dashcan from '../pages/canspace/Dash/Dashcan';
import Posts from '../pages/Dashboard/Post/Posts';
import JobPosts from '../pages/canspace/posts/JobPosts';
/** react routes */
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/result/:Aid',
    element: <QuizResult />
  },
  {
    path: '/signup',
    element: <SignupForm/>
  },
  {
    path: '/setting',
    element: <Setting/>
  },
  {
    path: '/rh-dashboard/:rhId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <RhDashboard />
  },
  {
    path: '/createQuiz/:rhId',
    element: <CreateQuiz/>
  },
{
  path: '/resultt/:Rid',
  element: <QuizResultt/>
},




  {
    path: '/:rhId/quiz-table', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <QuizTable />
  },
  {
    path: '/:rhId/quiz/:Qid', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <ViewQuiz />
  },
  {
    path: '/:rhId/updatequiz/:Qid',
    element: <Viewupdate />
  },
 
 { 
    path: '/:rhId/assign-quiz/:Qid/:canId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <SendQuiz />
  },
  {
    path: '/:rhId/QuizTable/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <QuizTable />
  },
  {
    path: '/QuizTest/:canId/:Aid/:Qid', // Utilisation $*our le paramètre du responsable RH
    element: <Quiztest />
  },
  {
    path: '/:canId/ViewResult/:Rid', // Utilisation $*our le paramètre du responsable RH
    element: <Quizresult />
  },
  { path: '/:canId/Trainyourself/', // Utilisation $*our le paramètre du responsable RH
    element: <Trainyourself />
 
    
  },
  {
    path: '/:canId/Requests', // Utilisation $*our le paramètre du responsable RH
    element: <Request />
  },
  {
    path: '/:rhId/UserProfile/', // Utilisation $*our le paramètre du responsable RH
    element: <EditProfile/>
  },
  {
    path: '/:canId/UserProfilee/', // Utilisation $*our le paramètre du responsable RH
    element: <EditProfilee/>
  },
 
  
  {
    path: '/:rhId/ViewmyProfile/', // Utilisation $*our le paramètre du responsable RH
    element: <ViewMyProfile />
  },
  {
    path: '/:canId/ViewmyProfilee/', // Utilisation $*our le paramètre du responsable RH
    element: <ViewMyProfilee />
  },

  {
    path: '/:rhId/userlist/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Userslist />
  },  
  {
    path: '/:canId/userlistt/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Userslistt />
  },
  {
    path: '/:rhId/ViewProfile/:canId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <ViewProfile />
  }, 
  {
    path: '/:canId/ViewProfilee/:canIdd', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <ViewProfilee />
  }, 
  {
    path: '/:rhId/friends/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Friends />
  }, 
  {
    path: '/:canId/friendss/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Friendss />
  }, 
  {
    path: '/:rhId/Search', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Search />
  }, 
  {
    path: '/:canId/Searchh', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Searchh />
  }, 
  {
    path: '/:rhId/Results', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Results />
  }, 
  {
    path: '/:rhId/TabAssign', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Assig />
  }, 

  {
    path: '/createassig/:rhId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <CreateAssign />
  },
  {
    path: '/Setting/:rhId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Setting />
  }, 
  {
    path: '/Settingg/:canId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Settingg />
  }, 
  {
    path: '/changepwd/:userId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Cpass/>
  }, 
  {
    path: '/changepwdd/:canId', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Cpasss/>
  }, 
   
  {
    path: '/candidate-dashboard/:canId', // Il semble que vous deviez ajuster '
    element: <CanDashboard/>
  },

  {
    path: '/:canId/Assignments/', // Il semble que vous deviez ajuster '
    element: <Assignments/>
  },
  {
    path: '/:canId/:Aid/:Qid/Quizstart/', // Utilisation $*our le paramètre du responsable RH
    element: <Descriptiontest/>
  },
  {
    path: '/:canId/Profile/', // Utilisation $*our le paramètre du responsable RH
    element: <ViewProfile/>
  },
  {
    path: '/:canId/RsultCan', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <ResultCan />
  }, 
  {
    path: '/:canId/test/:Qid', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Quiztestt />
  }, 
  {
    path:'/:canId/ViewResults/:Rid', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Quizresulttest/>
  },
  {
    path:'/:rhId/Dash/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Dash/>
  }, 
  {
    path:'/:canId/Dashcan/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Dashcan/>
  }, 
  {
    path:'/:rhId/Posts/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <Posts/>
  }, 
  {
    path:'/:canId/Jobposts/', // Utilisation de :rhId pour le paramètre du responsable RH
    element: <JobPosts/>
  }, 
]);

function App() {
  return (
    <>
   
      <RouterProvider router={router} />
    </>
  );
}

export default App;
