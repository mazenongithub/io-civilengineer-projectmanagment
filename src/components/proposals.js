import React, { Component } from 'react';
import './projectteam.css';
import * as actions from './actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MyStylesheet } from './styles';
import { inputUTCStringForLaborID } from './functions'
import PM from './pm';

class Proposals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '',
            width: 0,
            height: 0
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    showproposal(myproposal) {
        const styles = MyStylesheet();
        const pm = new PM();
        const regularFont = pm.getRegularFont.call(this)
        const myprovider = pm.getproviderbyid.call(this, myproposal.providerid)
        const providerid = this.props.match.params.providerid;
        const projectid = this.props.match.params.projectid;
        const proposalid = myproposal.proposalid;

        const company = () => {
            if (myprovider.hasOwnProperty("company")) {
                return myprovider.company.company;
            } else {
                return;
            }
        }
        const handlemyprovider = () => {
            if (myprovider) {
                return (`by ${myprovider.firstname} ${myprovider.lastname} ${company()}`)
            } else {
                return;
            }
        }

        return (<div style={{ ...styles.generalFont, ...regularFont, ...styles.generalContainer, ...styles.bottomMargin15 }}>
            <Link to={`/${providerid}/myprojects/${projectid}/proposals/${proposalid}`} style={{ ...styles.generalFont, ...regularFont, ...styles.generalLink }}> ProposalID {proposalid} {handlemyprovider()} Last Updated {inputUTCStringForLaborID(myproposal.updated)} Last Approved {inputUTCStringForLaborID(myproposal.approved)}</Link>
        </div>)
    }
    showproposals() {
        let pm = new PM();
        let myproposals = pm.getproposals.call(this);
        let proposals = [];
        if (myproposals) {
            // eslint-disable-next-line
            myproposals.map(myproposal => {
                proposals.push(this.showproposal(myproposal))
            })

        }
        return proposals;
    }
    render() {
        const styles = MyStylesheet();
        const projectid = this.props.match.params.projectid;
        const pm = new PM();
        const headerFont = pm.getHeaderFont.call(this)
        return (
            <div style={{ ...styles.generalFlex }}>
                <div style={{ ...styles.flex1 }}>

                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.alignCenter, ...headerFont, ...styles.generalFont }}>
                            /{projectid} <br />
                            Proposals
                        </div>
                    </div>

                    {this.showproposals()}

                </div>
            </div>)

    }
}

function mapStateToProps(state) {
    return {
        myusermodel: state.myusermodel,
        navigation: state.navigation,
        project: state.project,
        allusers: state.allusers,
        allcompanys: state.allcompanys
    }
}
export default connect(mapStateToProps, actions)(Proposals)