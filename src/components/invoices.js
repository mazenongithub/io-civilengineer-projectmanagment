import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadmyprojects } from './actions/api';
import { MyUserModel } from './functions';
import * as actions from './actions';
import ShowInvoices from './showinvoices';
import MyInvoices from './myinvoices'

class Invoices extends Component {
    componentDidMount() {
        let projectid = this.props.match.params.projectid;
        this.props.ProjectID({ projectid });
        this.props.reduxNavigation({ navigation: "invoices", projectid })
        if (!this.props.projects.hasOwnProperty("length") && !this.props.projectsprovider.hasOwnProperty("length")) {
            let providerid = this.props.match.params.providerid;
            this.getmyprojects(providerid);
        }

    }
    async getmyprojects(providerid) {
        let response = await loadmyprojects(providerid);
        console.log(response)



        if (response.hasOwnProperty("projectsprovider")) {
            // eslint-disable-next-line
            this.props.projectsProvider(response.projectsprovider.myproject)
        }
        if (response.hasOwnProperty("projectsmanaging")) {
            this.props.reduxProjects(response.projectsmanaging.myproject)
        }

        if (response.hasOwnProperty("providerid")) {
              let myusermodel = MyUserModel(response.providerid, response.firstname, response.lastname, response.company, response.occupation, response.jobtitle, response.laborrate, response.address, response.city, response.contactstate, response.zipcode, response.emailaddress, response.phonenumber, response.profileurl, response.stripe)
      
            this.props.updateUserModel(myusermodel)

        }
        this.setState({ render: 'render' })
    }

    getservicetype() {
        let servicetype = false;
        if (this.props.projectid) {
            let projectid = this.props.projectid.projectid;
            console.log(projectid)
            if (this.props.projects.hasOwnProperty("length")) {
                // eslint-disable-next-line
                this.props.projects.map(myproject => {
                    if (myproject.projectid === projectid) {
                        servicetype = myproject.servicetype;
                    }
                })
            } //maps projects

            if (!servicetype) {
                if (this.props.projectsprovider.hasOwnProperty("length")) {
                    // eslint-disable-next-line
                    this.props.projectsprovider.map(myproject => {
                        if (myproject.projectid === projectid) {
                            servicetype = myproject.servicetype;
                        }
                    })
                } //maps projects
            }

        }
        return servicetype;
    }
    handleinvoices() {
        if (this.props.projects.hasOwnProperty("length") || this.props.projectsprovider.hasOwnProperty("length")) {

            let servicetype = this.getservicetype();
            if (servicetype === "manager") {
                return (<ShowInvoices/>)
            }
            else if (servicetype === "provider") {
                return (<MyInvoices/>)
            }
            else {
                return (<span> &nbsp;</span>)
            }
        }
        else {
            return (<span> &nbsp;</span>)
        }

    }

    render() {
        return (<div> 
        {this.handleinvoices()}
        </div>)
    }


}

function mapStateToProps(state) {
    return {
        myusermodel: state.myusermodel,
        projectid: state.projectid,
        projects: state.projects,
        projectsprovider: state.projectsprovider
    }
}

export default connect(mapStateToProps, actions)(Invoices)