import './PageTransition.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const PageTransition = ({ children, location }) => {
    return (
        <TransitionGroup component={null}>
            <CSSTransition
                key={location.pathname}
                timeout={200}
                classNames="fade"
            >
                <div className="page-transition-container">
                    {children}
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default PageTransition;