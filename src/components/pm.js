import React from 'react';
import { ClientLogin } from './actions/api';
import firebase from 'firebase/app';
import 'firebase/auth';
import { returnCompanyList, sorttimes, inputUTCStringForLaborID } from './functions';
import { MyStylesheet } from './styles';
import { projectSaveAll } from './svg';
import { SaveAllProfile } from './actions/api';
import { Link } from 'react-router-dom';

class PM {
    getGoIcon() {
        if (this.state.width > 1200) {
            return ({ width: '101px', height: '85px' })
        } else if (this.state.width > 800) {
            return ({ width: '80px', height: '75px' })
        } else {
            return ({ width: '60px', height: '55px' })
        }
    }
    getuser() {
        let user = false;
        if (this.props.myusermodel) {
            if (this.props.myusermodel.hasOwnProperty("providerid")) {
                user = this.props.myusermodel;
            }
        }
        return user;
    }

    showlinedetail() {
        const pm = new PM();
        const styles = MyStylesheet();
        const regularFont = pm.getRegularFont.call(this);
        const totallabor = `$${Number(this.getlabortotal()).toFixed(2)}`
        const totalmaterials = `$${Number(this.getmaterialtotal()).toFixed(2)}`
        const totalequipment = `$${Number(this.getequipmenttotal()).toFixed(2)}`
        const totalamount = `$${Number(this.getitemtotal()).toFixed(2)}`
        const responsiveLayouts = () => {
            if (this.state.width > 800) {
                return (<div style={{ ...styles.generalFlex }}>
                    <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1 }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Labor
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getlaboritems()}
                                </div>


                            </div>
                            <div style={{ ...styles.flex1 }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Materials
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getmaterialitems()}
                                </div>

                            </div>
                        </div>
                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1 }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Equipment
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getequipmentitems()}
                                </div>


                            </div>
                            <div style={{ ...styles.flex1, ...styles.showBorder }}>

                                <div style={{ ...styles.generalContainer }}>
                                    Total Labor {totallabor}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total Materials {totalmaterials}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total Equipment {totalequipment}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total {totalamount}
                                </div>




                            </div>
                        </div>


                    </div>
                </div>)

            } else {
                return (
                    <div style={{ ...styles.generalFlex }}>
                        <div style={{ ...styles.flex1, ...styles.generalFont, ...regularFont }}>

                            <div style={{ ...styles.generalContainer }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Labor
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getlaboritems()}
                                </div>

                            </div>

                            <div style={{ ...styles.generalContainer }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Materials
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getmaterialitems()}
                                </div>


                            </div>
                            <div style={{ ...styles.generalContainer }}>

                                <div style={{ ...styles.generalContainer, ...styles.showBorder, ...styles.alignCenter }}>
                                    Equipment
                                </div>
                                <div style={{ ...styles.generalContainer, ...styles.showBorder }}>
                                    {this.getequipmentitems()}
                                </div>

                            </div>
                            <div style={{ ...styles.generalContainer }}>
                                <div style={{ ...styles.generalContainer }}>
                                    Total Labor {totallabor}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total Materials {totalmaterials}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total Equipment {totalequipment}
                                </div>
                                <div style={{ ...styles.generalContainer }}>
                                    Total {totalamount}
                                </div>
                            </div>


                        </div>
                    </div>
                )

            }
        }
        return responsiveLayouts();

    }
    getproposals() {
        const pm = new PM();
        let proposals = false;
        const myproject = pm.getproject.call(this);
        if (myproject.hasOwnProperty("proposals")) {
            proposals = myproject.proposals.myproposal;
        }
        return proposals;
    }
    getinvoices() {
        const pm = new PM();
        let invoices = false;
        const myproject = pm.getproject.call(this);
        if (myproject.hasOwnProperty("invoices")) {
            invoices = myproject.invoices.myinvoice;
        }
        return invoices;
    }
    getnavigation() {
        let navigation = false;
        if (this.props.navigation) {
            if (this.props.navigation.hasOwnProperty("navigation")) {
                navigation = this.props.navigation.navigation;
            }

        }
        return navigation;
    }
    getRegularFont() {
        const styles = MyStylesheet();
        if (this.state.width > 800) {
            return (styles.font30)
        } else {
            return (styles.font24)
        }

    }
    getactiveprojectbackground(projectid) {
        const pm = new PM();
        let activeprojectid = pm.getactiveprojectid.call(this);
        if (activeprojectid) {
            if (projectid === activeprojectid) {
                return ({ backgroundColor: '#F7DAF4' })
            } else {
                return;
            }
        } else {
            return;
        }
    }
    getbidfield() {
        if (this.state.width > 800) {
            return ({ maxWidth: '138px' })
        } else {
            return ({ maxWidth: '90px' })
        }
    }
    getAllActual() {
        let actuals = [];
        const pm = new PM();
        const myproject = pm.getproject.call(this);

        if (myproject) {
            if (myproject.hasOwnProperty("actuallabor")) {
                // eslint-disable-next-line
                myproject.actuallabor.mylabor.map(mylabor => {
                    actuals.push(mylabor)
                })
            }
            if (myproject.hasOwnProperty("actualequipment")) {
                // eslint-disable-next-line
                myproject.actualequipment.myequipment.map(myequipment => {
                    actuals.push(myequipment)
                })
            }
            if (myproject.hasOwnProperty("actualmaterials")) {
                // eslint-disable-next-line
                myproject.actualmaterials.mymaterial.map(mymaterial => {
                    actuals.push(mymaterial)
                })

            }

            actuals.sort((a, b) => {
                return sorttimes(a.timein, b.timein)
            })
        }

        return actuals;
    }
    getAllSchedule() {
        let schedules = [];
        const pm = new PM();
        const myproject = pm.getproject.call(this);

        if (myproject) {
            if (myproject.hasOwnProperty("schedulelabor")) {
                // eslint-disable-next-line
                myproject.schedulelabor.mylabor.map(mylabor => {
                    schedules.push(mylabor)
                })
            }
            if (myproject.hasOwnProperty("scheduleequipment")) {
                // eslint-disable-next-line
                myproject.scheduleequipment.myequipment.map(myequipment => {
                    schedules.push(myequipment)
                })
            }
            if (myproject.hasOwnProperty("schedulematerials")) {
                // eslint-disable-next-line
                myproject.schedulematerials.mymaterial.map(mymaterial => {
                    schedules.push(mymaterial)
                })

            }

            schedules.sort((a, b) => {
                return sorttimes(a.timein, b.timein)
            })
        }

        return schedules;
    }

    getactualcsibyid(csiid) {
        let mycsi = false;
        const pm = new PM();
        const myinvoices = pm.getinvoices.call(this)
        if (myinvoices) {
            // eslint-disable-next-line
            myinvoices.map(myinvoice => {
                if (myinvoice.hasOwnProperty("bid")) {
                    // eslint-disable-next-line
                    myinvoice.bid.biditem.map(biditem => {
                        if (biditem.csiid === csiid) {
                            mycsi = { csiid, csi: biditem.csi, title: biditem.title }

                        }
                    })
                }
            })


        }
        return mycsi;
    }

    showprojectid() {
        const styles = MyStylesheet();
        const pm = new PM();
        const headerFont = pm.getHeaderFont.call(this)
        const regularFont = pm.getRegularFont.call(this)
        const myuser = pm.getuser.call(this)

        if (myuser) {
            const providerid = myuser.providerid;
            const myproject = pm.getactiveproject.call(this)
            if (myproject) {

                return (<div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...styles.alignCenter, ...headerFont }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}`} style={{ ...headerFont, ...styles.generalFont, ...styles.generalLink }}> /{myproject.projectid}</Link>
                            </div>
                        </div>

                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/team`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}>Project Team</Link>
                            </div>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/milestones`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}> Create Milestones</Link>
                            </div>
                        </div>
                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/bidschedule`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}> View Bid Schedule </Link>
                            </div>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/bid`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}> View Bid </Link>
                            </div>
                        </div>
                        <div style={{ ...styles.generalFlex }}>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/proposals`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}> View Proposals</Link>
                            </div>
                            <div style={{ ...styles.flex1, ...styles.showBorder, ...regularFont, ...styles.alignCenter }}>
                                <Link to={`/${providerid}/myprojects/${myproject.projectid}/invoices`} style={{ ...regularFont, ...styles.generalFont, ...styles.generalLink }}> View Invoices </Link>
                            </div>
                        </div>

                    </div>
                </div>)

            }
        }
    }

    getschedulecsibyid(csiid) {

        let mycsi = false;
        const pm = new PM();
        const myproposals = pm.getproposals.call(this)
        if (myproposals) {
            // eslint-disable-next-line
            myproposals.map(myproposal => {
                if (myproposal.hasOwnProperty("bidschedule")) {
                    // eslint-disable-next-line
                    myproposal.bidschedule.biditem.map(biditem => {
                        if (biditem.csiid === csiid) {
                            mycsi = { csiid, csi: biditem.csi, title: biditem.title }


                        }
                    })
                }
            })


        }

        return mycsi;
    }


    getinvoicebyid(invoiceid) {
        let invoice = false;
        const pm = new PM();
        const myproject = pm.getproject.call(this);
        if (myproject.hasOwnProperty("invoices")) {
            // eslint-disable-next-line
            myproject.invoices.myinvoice.map(myinvoice => {
                if (myinvoice.invoiceid === invoiceid) {
                    invoice = myinvoice;
                }
            })
        }
        return invoice;
    }
    getproposalbyid(proposalid) {
        let proposal = false;
        const pm = new PM();
        const myproject = pm.getproject.call(this);
        if (myproject.hasOwnProperty("proposals")) {
            // eslint-disable-next-line
            myproject.proposals.myproposal.map(myproposal => {
                if (myproposal.proposalid === proposalid) {
                    proposal = myproposal;
                }
            })
        }
        return proposal;
    }
    showbidtable() {

        const pm = new PM();
        const styles = MyStylesheet();
        const regularFont = pm.getRegularFont.call(this);


        if (this.state.width > 1200) {
            return (
                <table width="100%" border="1" style={{ ...regularFont, ...styles.generalFont }}>
                    <tr>
                        <td width="24%" style={{ ...styles.alignCenter }}>Line ID</td>
                        <td width="12%" style={{ ...styles.alignCenter }}>Quantity</td>
                        <td width="13%" style={{ ...styles.alignCenter }}>Unit</td>
                        <td width="13%" style={{ ...styles.alignCenter }}>Direct Cost</td>
                        <td width="13%" style={{ ...styles.alignCenter }}> Overhead and Profit %</td>
                        <td width="13%" style={{ ...styles.alignCenter }}>Bid Price</td>
                        <td width="12%" style={{ ...styles.alignCenter }}>Unit Price</td>
                    </tr>
                    {this.showbiditems()}
                </table>

            )
        } else {
            return (
                <div style={{ ...styles.generalFlex, ...styles.bottomMargin15 }}>
                    <div style={{ ...styles.flex1 }}>

                        {this.showbiditems()}

                    </div>
                </div>
            )
        }
    }
    getHeaderFont() {
        const styles = MyStylesheet();
        if (this.state.width > 800) {
            return (styles.font40)
        } else {
            return (styles.font30)
        }

    }
    getallprojects() {
        const pm = new PM();
        let allprojects = [];
        const myuser = pm.getuser.call(this);
        if (myuser) {
            if (myuser.hasOwnProperty("projects")) {
                allprojects = myuser.projects.myproject;
            }

        }
        return allprojects;

    }
    getactiveproject() {
        let pm = new PM();
        let myprojects = pm.getallprojects.call(this);
        let projectid = pm.getactiveprojectid.call(this);

        let myproject = false;
        if (myprojects && projectid) {
            // eslint-disable-next-line
            myprojects.map(project => {
                if (project.projectid === projectid) {
                    myproject = project;
                }
            })
        }
        return myproject;
    }
    getactiveprojectkey() {
        let pm = new PM();
        let myprojects = pm.getprojects.call(this);
        let projectid = pm.getactiveprojectid.call(this);
        let key = false;
        if (myprojects && projectid) {
            // eslint-disable-next-line
            myprojects.map((project, i) => {
                if (project.projectid === projectid) {
                    key = i;
                }
            })
        }
        return key;
    }
    getactiveprojectid() {
        let projectid = "";
        if (this.props.project) {
            if (this.props.project.hasOwnProperty("projectid")) {
                projectid = this.props.project.projectid;
            }

            return projectid;
        }
    }
    getprojects() {
        let projects = [];
        let pm = new PM();
        let myuser = pm.getuser.call(this);
        if (myuser) {
            if (myuser.hasOwnProperty("projects")) {
                projects = myuser.projects.myproject;
            }
        }
        return projects;
    }
    getteamprofile() {
        if (this.state.width > 800) {
            return ({ width: '200px', height: '150px' })
        } else {
            return ({ width: '160px', height: '120px' })
        }
    }
    getproviderbyid(providerid) {

        let provider = false;
        if (this.props.allusers) {

            if (this.props.allusers.hasOwnProperty("myuser")) {

                // eslint-disable-next-line
                this.props.allusers.myuser.map(myuser => {

                    if (myuser.providerid === providerid) {

                        provider = myuser;
                    }
                })

            }
        }
        return provider;
    }
    getprojectteam() {
        const pm = new PM();
        const myproject = pm.getproject.call(this);
        let myteam = false;
        if (myproject.hasOwnProperty("projectteam")) {
            myteam = myproject.projectteam.myteam;
        }
        return myteam;
    }
    getproject() {
        let pm = new PM();
        let myuser = pm.getuser.call(this)
        let project = false;
        let projectid = this.props.match.params.projectid;
        if (myuser) {
            if (myuser.hasOwnProperty("projects")) {
                // eslint-disable-next-line
                myuser.projects.myproject.map(myproject => {
                    if (myproject.projectid === projectid) {
                        project = myproject;
                    }
                })
            }

        }

        return project;
    }
    getSmallFont() {
        const styles = MyStylesheet();
        if (this.state.width > 800) {
            return (styles.font20)
        } else {
            return (styles.font18)
        }

    }
    getprojectkey() {
        const pm = new PM();
        let key = false;
        const projects = pm.getprojects.call(this)
        if (projects) {
            let projectid = this.props.match.params.projectid;
            // eslint-disable-next-line
            projects.map((myproject, i) => {
                if (myproject.projectid === projectid) {
                    key = i;
                }
            })
        }
        return key;
    }
    getprojectid() {
        let projectid = "";
        if (this.props.project) {
            if (this.props.project.hasOwnProperty("projectid")) {
                projectid = this.props.project.projectid;
            }

        }
        return projectid;
    }
    gettouchicon() {
        if (this.state.width > 800) {
            return ({
                width: '58px',
                height: '84px'
            })

        } else {
            return ({
                width: '44px',
                height: '59px'
            })
        }

    }

    getcolumns() {
        if (this.state.width > 1200) {
            return ({ gridTemplateColumns: '33% 33% 34%' })

        } else if (this.state.width > 800) {
            return ({ gridTemplateColumns: '50% 50%' })

        } else {
            return ({ gridTemplateColumns: 'auto' })
        }
    }
    getallusers() {
        let allusers = false;
        if (this.props.allusers) {
            if (this.props.allusers.hasOwnProperty("myuser")) {
                allusers = this.props.allusers.myuser;
            }

        }
        return allusers;
    }
    getsaveprojecticon() {
        if (this.state.width > 800) {
            return ({
                width: '377px',
                height: '84px'
            })

        } else {
            return ({
                width: '225px',
                height: '60px'
            })
        }

    }
    async saveallprofilebyuser(myuser) {

        if (myuser) {
            try {
                let response = await SaveAllProfile({ myuser });
                if (response.hasOwnProperty("allusers")) {
                    let companys = returnCompanyList(response.allusers);
                    this.props.reduxAllCompanys(companys)
                    this.props.reduxAllUsers(response.allusers);
                    delete response.allusers;

                }
                if (response.hasOwnProperty("providerid")) {
                    console.log(response)
                    this.props.reduxUser(response)
                }
                if (response.hasOwnProperty("message")) {
                    let lastupdated = inputUTCStringForLaborID(response.lastupdated)
                    this.setState({ message: `${response.message} Last updated ${lastupdated}` })
                }
            } catch (err) {
                alert(err)
            }
        }
    }
    async saveallprofile() {
        const pm = new PM();
        const myuser = pm.getuser.call(this)
        if (myuser) {
            try {
                let response = await SaveAllProfile({ myuser });
                if (response.hasOwnProperty("allusers")) {
                    let companys = returnCompanyList(response.allusers);
                    this.props.reduxAllCompanys(companys)
                    this.props.reduxAllUsers(response.allusers);
                    delete response.allusers;

                }
                if (response.hasOwnProperty("providerid")) {
                    console.log(response)
                    this.props.reduxUser(response)
                }
                if (response.hasOwnProperty("message")) {
                    let lastupdated = inputUTCStringForLaborID(response.lastupdated)
                    this.setState({ message: `${response.message} Last updated ${lastupdated}` })
                }
            } catch (err) {
                alert(err)
            }
        }
    }
    getFolderSize() {
        if (this.state.width > 1200) {
            return (
                {
                    width: '142px',
                    height: '88px'
                })

        } else if (this.state.width > 800) {
            return (
                {
                    width: '93px',
                    height: '76px'
                })

        } else {
            return (
                {
                    width: '88px',
                    height: '61px'
                })
        }

    }
    getArrowHeight() {
        if (this.state.width > 800) {
            return (
                {
                    width: '55px',
                    height: '48px'
                })

        } else {
            return (
                {
                    width: '45px',
                    height: '34px'
                })
        }

    }
    getprofiledimensions() {
        if (this.state.width > 1200) {
            return (
                {
                    width: '392px',
                    height: '327px'
                })

        } else if (this.state.width > 800) {
            return (
                {
                    width: '285px',
                    height: '249px'
                })

        } else {
            return (
                {
                    width: '167px',
                    height: '145px'
                })
        }
    }
    showsaveproject() {
        const pm = new PM();
        const regularFont = pm.getRegularFont.call(this);
        const saveprojecticon = pm.getsaveprojecticon.call(this);

        const styles = MyStylesheet();
        return (
            <div style={{ ...styles.generalContainer, ...styles.bottomMargin15 }}>
                <div style={{ ...styles.generalContainer, ...styles.alignCenter, ...styles.generalFont, ...regularFont, ...styles.topMargin15, ...styles.bottomMargin15 }}>
                    {this.state.message}
                </div>

                <div style={{ ...styles.generalContainer, ...styles.alignCenter }}>
                    <button style={{ ...styles.generalButton, ...saveprojecticon }} onClick={() => { pm.saveallprofile.call(this) }}>{projectSaveAll()}</button>
                </div>
            </div>)
    }
    async appleSignIn() {
        let provider = new firebase.auth.OAuthProvider('apple.com');

        provider.addScope('email');
        provider.addScope('name');
        try {
            let result = await firebase.auth().signInWithPopup(provider)

            // The signed-in user info.
            var user = result.user;
            console.log(user.providerData[0])
            let client = 'apple';
            let clientid = user.providerData[0].uid;
            let firstname = '';
            if (user.providerData[0].displayName) {
                firstname = user.providerData[0].displayName.split(' ')[0]
            }

            let lastname = '';
            if (user.providerData[0].displayName) {
                lastname = user.providerData[0].displayName.split(' ')[1]
            }
            let emailaddress = user.providerData[0].email;
            let profileurl = user.providerData[0].photoURL;
            let phonenumber = user.phoneNumber;
            let values = { client, clientid, firstname, lastname, emailaddress, profileurl, phonenumber }
            const response = await ClientLogin(values);
            if (response.hasOwnProperty("allusers")) {
                let companys = returnCompanyList(response.allusers);
                this.props.reduxAllCompanys(companys)
                this.props.reduxAllUsers(response.allusers);
                delete response.allusers;

            }
            if (response.hasOwnProperty("providerid")) {
                console.log(response)
                this.props.reduxUser(response)
            }



        } catch (error) {

            alert(error.message);

        }


    }

    async googleSignIn() {


        try {


            let provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');
            let result = await firebase.auth().signInWithPopup(provider)
            var user = result.user;
            console.log(user.providerData[0]);
            let client = 'google';
            let clientid = user.providerData[0].uid;
            let firstname = '';
            if (user.providerData[0].displayName) {
                firstname = user.providerData[0].displayName.split(' ')[0]
            }

            let lastname = '';
            if (user.providerData[0].displayName) {
                lastname = user.providerData[0].displayName.split(' ')[1]
            }
            let emailaddress = user.providerData[0].email;
            let profileurl = user.providerData[0].photoURL;
            let phonenumber = user.phoneNumber;
            let values = { client, clientid, firstname, lastname, emailaddress, profileurl, phonenumber }

            const response = await ClientLogin(values);
            if (response.hasOwnProperty("allusers")) {
                let companys = returnCompanyList(response.allusers);
                this.props.reduxAllCompanys(companys)
                this.props.reduxAllUsers(response.allusers);
                delete response.allusers;

            }
            if (response.hasOwnProperty("providerid")) {
                console.log(response)
                this.props.reduxUser(response)
            }


        } catch (error) {
            alert(error)
        }


    }

}
export default PM;