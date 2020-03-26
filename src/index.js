import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';
//import { isCompositeComponent } from 'react-dom/test-utils';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navOrder: ['about', 'projects', 'contact'],
            navOptions: {
                about: true, 
                projects: false, 
                contact: false
            },
            lastScroll: 0,
        }
    }

    handleClick(item) {

        const pageLength = this.pageLength;

        for (let key in this.state.navOptions) {
            if(item === key && this.state.navOptions[item]) {
                this.setState({ lastScroll: (this.state.navOrder.indexOf(key) * pageLength) })
                document.getElementById(key).scrollIntoView(true);
                return;
            } else if(item === key && !this.state.navOptions[item]) {
                this.setState(prevState => {
                    let navOptions = { ...prevState.navOptions };
                    navOptions[item] = true;                   
                    return { navOptions };                               
                });
                this.setState({ lastScroll: (this.state.navOrder.indexOf(key) * pageLength) })
                document.getElementById(key).scrollIntoView(true);
            } else {
                this.setState(prevState => {
                    let navOptions = { ...prevState.navOptions };
                    navOptions[key] = false;                   
                    return { navOptions };                               
                });
            }
        }
        this.clickFired = true;        
    }

    scrollHelper(navOrder, pageLength, i, num) {
        this.setState(prevState => {
            let navOptions = { ...prevState.navOptions };
            navOptions[navOrder[i]] = false;
            navOptions[navOrder[i + num]] = true;
            return { navOptions };                               
        });
        this.setState({ lastScroll: (i + num) * pageLength })
        window.scrollTo(0, this.state.lastScroll);
    }

    handleScroll = () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        if (this.clickFired) {
            if (st === this.state.lastScroll) {
                this.clickFired = false;
            }
        } else if (!this.scrolled) {
            document.body.style.overflow = 'hidden';
            this.scrolled = true;
            if (!this.screenCheck) {
                this.setState({ lastScroll: 0 });
            } else {
                let st = window.pageYOffset || document.documentElement.scrollTop;
                const navLength = this.navLength;
                const navOptions = this.state.navOptions;
                const navOrder = this.navOrder;
                const pageLength = this.pageLength;     
                
                if (st > this.state.lastScroll) {
                    for (let i=0; i < navLength; i++) {
                        if (navOptions[navOrder[i]] && i < navLength - 1) {
                            this.scrollHelper(navOrder, pageLength, i, 1);
                            break;
                        }
                    }
                } else {
                    for (let i=0; i < navLength; i++) {
                        if (navOptions[navOrder[i]] && i > 0) {
                            this.scrollHelper(navOrder, pageLength, i, -1);
                            break;
                        }
                    }
                }                
            }
            setTimeout(() => {
                this.scrolled = false;
                this.screenCheck = true;
                document.body.style.overflow = 'visible';
            }, 1000);
        }
    }

    alterPageLength = () => {
        this.bodyRect = document.body.getBoundingClientRect();
        this.rect = document.getElementById([this.navOrder[0]]).getBoundingClientRect();
        this.pageLength = this.rect.bottom - this.bodyRect.top; 
    }
    componentDidMount() {
        this.setState({ lastScroll: window.pageYOffset });
        this.scrolled = false;
        this.clickFired = false;
        this.navLength = this.state.navOrder.length;
        this.navOrder = this.state.navOrder;
        this.screenCheck = this.state.lastScroll === window.pageYOffset;
        
        this.bodyRect = document.body.getBoundingClientRect();
        this.rect = document.getElementById([this.navOrder[0]]).getBoundingClientRect();
        this.pageLength = this.rect.bottom - this.bodyRect.top; 
        window.scrollTo(0, this.state.lastScroll);


        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.alterPageLength);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleScroll);
        window.removeEventListener('resize', this.alterPageLength);
    }

    render() {
        return (
            <div>
                <About />
                <Projects />
                <Contact />
                <DotNav 
                    onClick={(item) => this.handleClick(item)} 
                    navOptions={this.state.navOptions}
                />
            </div>
        );
    }
}

class DotNav extends React.Component {

    render() {
        const dots = Object.keys(this.props.navOptions).map((item) => 
            <Dot 
                key={item}
                link={item} 
                active={this.props.navOptions[item]} 
                onClick={() => this.props.onClick(item)}
            />
        )
        return (
            <div id='dot-nav'>
                {dots}
            </div>
        );
    }
}

function Dot(props) {
    return (
        <div 
            id={props.link + '-nav'} 
            className='dot'
            style={{ backgroundColor: props.active ? 'rgb(30, 30, 30)' : '' }}
            onClick={props.onClick}
        />
    );
}

function About(props) {
        return (
            <div id='about' className='bg' >
                <div id='about-text'>
                    <h1>Hi, I'm Jeff</h1>
                    <p>Passionate about marketing, strategy, technology & design</p>
                </div>
                <div id='arrow' />
            </div>
        );
}

function Projects(props) {
    return (
        <div id='projects' className='bg' >
            <h1>Projects</h1>
                <Project name='Photography'/>
                <Project name='Apps'/>
                <Project name='Data' />
                <Project name='Games' />
        </div>
    );
}

function Project(props) {
    return (
        <div id={props.name.toLowerCase()} className='project-item'>
            <p>{props.name}</p>
        </div>
    );
    //Project link shows details on hover
}

function Contact(props) {
    return (
        <div id='contact' className='bg' >
            <h1>Contact Me</h1>
            <p>Email LinkedIn Instagram</p>
        </div>
        
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
