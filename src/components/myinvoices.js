import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';
import { ProviderEndPoint, InsertInvoice } from './actions/api'
import './proposals.css';
import {
    sorttimes,
    inputUTCStringForLaborID,
    calculatetotalhours,
    validateLaborRate,
    inputUTCStringForMaterialIDWithTime,
    UTCTimefromCurrentDate,
    UTCStringFormatDateforProposal

}
    from './functions';
import './createinvoice.css';
import {
    removeProposalIcon,
    createInvoiceID,
    clearInvoiceID,
    saveallprojectactual,
    removeIcon
}
    from './svg';


class MyInvoices extends Component {

    constructor(props) {
        super(props)
        this.state = {
            render: '',
            invoiceidmsg: 'Invoice ID is clear, Click to Create A New Invoice',
            message: "",
            activeinvoiceid: "",
            width: "",
            height: ""
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

    loadinvoiceids() {
        let invoiceids = []
        if (this.props.projectsprovider.hasOwnProperty("length")) {
            let projectid = this.props.projectid.projectid;
            // eslint-disable-next-line
            this.props.projectsprovider.map(myproject => {
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("invoices")) {
                        // eslint-disable-next-line
                        myproject.invoices.myinvoice.map(myinvoice => {

                            invoiceids.push(this.showinvoiceid(myinvoice.invoiceid))
                        })
                    }
                }
            })
        }
        return invoiceids;
    }
    showinvoiceicon(invoiceid) {
        return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 599 115"><defs>
            <style></style></defs><title>invoiceid</title><g id="Layer_2" data-name="Layer 2">
                <g id="Layer_1-2" data-name="Layer 1">
                    <rect className="invoiceid-1" x="8.5" y="0.5" width="590" height="114" rx="8.69" />
                    <text className="invoiceid-2" transform="translate(145.46 65.7)">In<tspan className="invoiceid-3" x="32.96" y="0">v</tspan>
                        <tspan x="53.28" y="0">oiceID</tspan>
                        <tspan className="invoiceid-4" x="177" y="0">{invoiceid}</tspan></text></g></g></svg>)
    }
    findinvoice(event, invoiceid) {
        this.setState({ activeinvoiceid: invoiceid, invoiceidmsg: `Active InvoiceID is ${invoiceid}` })

    }
    deleteInvoice(event, invoiceid) {
        if (window.confirm(`Are you sure you want to delete Invoice ID ${invoiceid}?`)) {
            if (this.props.projectsprovider.hasOwnProperty("length")) {
                let projectid = this.props.projectid.projectid;
                // eslint-disable-next-line
                this.props.projectsprovider.map((myproject, i) => {
                    if (myproject.projectid === projectid) {
                        if (myproject.hasOwnProperty("actuallabor")) {
                            // eslint-disable-next-line
                            myproject.actuallabor.mylabor.map((mylabor, j) => {
                                if (mylabor.invoiceid === invoiceid) {
                                    this.props.projectsprovider[i].actuallabor.mylabor[j].invoiceid = "";
                                }


                            })
                        }

                        if (myproject.hasOwnProperty("actualmaterials")) {
                            // eslint-disable-next-line
                            myproject.actualmaterials.mymaterial.map((mymaterial, j) => {
                                if (mymaterial.invoiceid === invoiceid) {
                                    this.props.projectsprovider[i].actualmaterials.mymaterial[j].invoiceid = "";
                                }


                            })

                        }

                        if (myproject.hasOwnProperty("invoices")) {
                            // eslint-disable-next-line
                            myproject.invoices.myinvoice.map((myinvoice, j) => {
                                if (myinvoice.invoiceid === invoiceid) {
                                    this.props.projectsprovider[i].invoices.myinvoice.splice(j, 1)
                                }
                            })
                        }
                    }
                })

                let obj = this.props.projectsprovider;
                this.props.projectsProvider(obj);
                this.setState({ activeinvoiceid: "" })
            }
        }
    }
    showinvoiceid(invoiceid) {

        return (<div className="proposal-title-row">
            <button className="proposals-button" onClick={event => { this.findinvoice(event, invoiceid) }}>{this.showinvoiceicon(invoiceid)} </button>
            <button className="removeid-icon" onClick={event => { this.deleteInvoice(event, invoiceid) }}>{removeProposalIcon()} </button>
        </div>)
    }
    getproject() {
        let project = {};
        if (this.props.projectsprovider.hasOwnProperty("length")) {
            let projectid = this.props.projectid.projectid;
            // eslint-disable-next-line
            this.props.projectsprovider.map(myproject => {
                if (myproject.projectid === projectid) {
                    project = myproject;
                }
            })
        }
        return project;
    }
    getprojecttitle() {
        let title = "";
        if (this.props.projectsprovider.hasOwnProperty("length")) {
            let myproject = this.getproject()
            title = `${myproject.projectid}/${myproject.title}`
        }

        return title;
    }
    clearinvoiceid(event) {
        this.setState({
            activeinvoiceid: "",
            invoiceidmsg: 'Invoice ID is clear, Click to Create A New Invoice',
            message: ''
        })
    }
    validateproject() {
        let errmsg = "";
        if (this.props.projectsprovider) {
            let projectid = this.props.projectid.projectid;
            // eslint-disable-next-line
            this.props.projectsprovider.map(myproject => {
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("actuallabor")) {
                        // eslint-disable-next-line
                        myproject.actuallabor.mylabor.map(mylabor => {
                            if (!mylabor.milestoneid) {
                                errmsg = `${mylabor.laborid} is missing a milestone `
                            }
                            errmsg += `${validateLaborRate(mylabor.laborrate)}`
                        })
                    }

                    if (myproject.hasOwnProperty("actualmaterials")) {
                        // eslint-disable-next-line
                        myproject.actualmaterials.mymaterial.map(mymaterial => {
                            if (!mymaterial.milestoneid) {
                                errmsg = `${mymaterial.materialid} is missing a milestone `

                            }
                            errmsg += `${validateLaborRate(mymaterial.unitcost)}`
                            errmsg += `${validateLaborRate(mymaterial.quantity)}`
                        })
                    }


                }
            })
        }

        return errmsg;

    }
    async createnewinvoice() {
        let errmsg = this.validateproject();
        if (!errmsg) {
            let providerid = this.props.myusermodel.providerid;
            let projectid = this.props.projectid.projectid;
            let myproject = this.getproject();
            let values = { providerid, projectid, myproject }
            let response = await InsertInvoice(values);
            console.log(response);
            if (response.hasOwnProperty("projectsprovider")) {
                let updatedproject = response.projectsprovider.myproject[0];
                if (this.props.projectsprovider.hasOwnProperty("length")) {
                    // eslint-disable-next-line
                    this.props.projectsprovider.map((myproject, i) => {
                        if (myproject.projectid === projectid) {
                            this.props.projectsprovider[i] = updatedproject;
                            let obj = this.props.projectsprovider;
                            let dateupdated = inputUTCStringForLaborID(response.dateupdated)
                            this.props.projectsProvider(obj);
                            this.setState({ activeinvoiceid: response.insertinvoice, invoiceidmsg: `Active Invoice ID is ${response.insertinvoice}, Select Items to Add to the Invoice `, message: `Last Updated ${response.message} ${dateupdated}` })
                        }
                    })
                }
            }
        }
        else {
            this.setState({ message: errmsg })
        }

    }
    handletopIcon() {
        if (this.state.activeinvoiceid) {
            return (<button className="proposals-button" onClick={event => { this.clearinvoiceid(event) }}>{clearInvoiceID()}</button>)
        }
        else {
            return (<button className="proposals-button" onClick={event => { this.createnewproposal() }}>{createInvoiceID()}</button>)
        }
    }
    getproposalamount() {
        let amount = 0;
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            let myproject = this.getproject();
            if (myproject.hasOwnProperty("actuallabor")) {
                // eslint-disable-next-line
                myproject.actuallabor.mylabor.map(mylabor => {
                    if (mylabor.invoiceid === invoiceid) {
                        amount += Number(calculatetotalhours(mylabor.timeout, mylabor.timein)) * Number(mylabor.laborrate)
                    }

                })
            }

            if (myproject.hasOwnProperty("actualmaterials")) {
                // eslint-disable-next-line
                myproject.actualmaterials.mymaterial.map(mymaterial => {
                    if (mymaterial.invoiceid === invoiceid) {
                        amount += Number(mymaterial.quantity) * Number(mymaterial.unitcost)
                    }
                })
            }
        }
        return (`$${amount.toFixed(2)}`)
    }
    loadproposalitems() {
        let items = [];
        let proposal = [];

        if (this.state.activeinvoiceid) {
            proposal.push(<div className="proposal-main-row">Viewing All Proposed Schedule, Add the Item to the Invoice {this.state.activeinvoiceid}</div>)
            if (this.props.projectsprovider.hasOwnProperty("length")) {
                let myproject = this.getproject();
                if (myproject.hasOwnProperty("actuallabor")) {
                    // eslint-disable-next-line
                    myproject.actuallabor.mylabor.map(mylabor => {
                        items.push(mylabor)
                    })
                }
                if (myproject.hasOwnProperty("actualmaterials")) {
                    // eslint-disable-next-line
                    myproject.actualmaterials.mymaterial.map(mymaterial => {
                        items.push(mymaterial);
                    })
                }
            }
            items.sort((a, b) => {
                return sorttimes(a.timein, b.timein)
            })
            // eslint-disable-next-line
            items.map(item => {
                if (item.hasOwnProperty("laborid")) {
                    proposal.push(this.showlaborid(item))
                }
                else if (item.hasOwnProperty("materialid")) {
                    proposal.push(this.showmaterialid(item))
                }
            })
            proposal.push(<div className="proposal-title-row"> The Total Amount for Invoice {this.state.activeinvoiceid} is {this.getproposalamount()}</div>)

        }
        return proposal;
    }
    findmymaterial(materialid) {

        let material = {};
        let myproject = this.getproject();
        if (myproject.hasOwnProperty("actualmaterials")) {
            // eslint-disable-next-line
            myproject.actualmaterials.mymaterial.map(mymaterial => {
                if (mymaterial.materialid === materialid) {
                    material = mymaterial;
                }
            })
        }
        return material;

    }
    getmylabor(laborid) {

        let myproject = this.getproject();
        let labor = {};
        if (myproject.hasOwnProperty("actuallabor")) {
            // eslint-disable-next-line
            myproject.actuallabor.mylabor.map(mylabor => {
                if (mylabor.laborid === laborid) {

                    labor = mylabor;
                }
            })
        }
        return labor;
    }
    handlematerialicon(materialid) {
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            let mymaterial = this.findmymaterial(materialid)
            if (mymaterial.invoiceid === invoiceid) {
                return (<button className="btn-removeIcon general-button" onClick={event => { this.removematerial(materialid) }}>
                    {removeIcon()}
                </button>)
            }
            else {
                return (<span>&nbsp;</span>)
            }
        }

    }
    addlabor(laborid) {
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            // eslint-disable-next-line
            this.props.projectsprovider.map((myproject, i) => {
                let projectid = this.props.projectid.projectid;
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("actuallabor")) {
                        // eslint-disable-next-line
                        myproject.actuallabor.mylabor.map((mylabor, j) => {
                            if (mylabor.laborid === laborid) {
                                this.props.projectsprovider[i].actuallabor.mylabor[j].invoiceid = invoiceid;
                                this.updatetime(invoiceid)
                                let obj = this.props.projectsprovider;
                                this.props.projectsProvider(obj)
                                this.setState({ render: 'render' })
                            }
                        })
                    }
                }
            })
        }
    }


    removelabor(laborid) {
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            // eslint-disable-next-line
            this.props.projectsprovider.map((myproject, i) => {
                let projectid = this.props.projectid.projectid;
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("actuallabor")) {
                        // eslint-disable-next-line
                        myproject.actuallabor.mylabor.map((mylabor, j) => {
                            if (mylabor.laborid === laborid) {
                                this.props.projectsprovider[i].actuallabor.mylabor[j].invoiceid = "";
                                this.updatetime(invoiceid)
                                let obj = this.props.projectsprovider;
                                this.props.projectsProvider(obj)
                                this.setState({ render: 'render' })
                            }
                        })
                    }
                }
            })
        }
    }
    addmaterial(materialid) {
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            // eslint-disable-next-line
            this.props.projectsprovider.map((myproject, i) => {
                let projectid = this.props.projectid.projectid;
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("actualmaterials")) {
                        // eslint-disable-next-line
                        myproject.actualmaterials.mymaterial.map((mymaterial, j) => {
                            if (mymaterial.materialid === materialid) {
                                this.props.projectsprovider[i].actualmaterials.mymaterial[j].invoiceid = invoiceid;
                                this.updatetime(invoiceid)
                                let obj = this.props.projectsprovider;
                                this.props.projectsProvider(obj)
                                this.setState({ render: 'render' })
                            }
                        })
                    }
                }
            })
        }
    }
    updatetime(invoiceid) {
        if (this.props.projectsprovider.hasOwnProperty("length")) {
            let projectid = this.props.projectid.projectid;
            // eslint-disable-next-line
            this.props.projectsprovider.map((myproject, i) => {
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("proposals")) {
                        // eslint-disable-next-line
                        myproject.invoices.myinvoice.map((myinvoice, j) => {
                            if (myinvoice.invoiceid === invoiceid) {

                                this.props.projectsprovider[i].invoices.myinvoice[j].updated = UTCTimefromCurrentDate();
                            }
                        })
                    }
                }
            })
        }
    }

    removematerial(materialid) {

        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            // eslint-disable-next-line
            this.props.projectsprovider.map((myproject, i) => {
                let projectid = this.props.projectid.projectid;
                if (myproject.projectid === projectid) {
                    if (myproject.hasOwnProperty("actualmaterials")) {
                        // eslint-disable-next-line
                        myproject.actualmaterials.mymaterial.map((mymaterial, j) => {
                            if (mymaterial.materialid === materialid) {
                                this.props.projectsprovider[i].actualmaterials.mymaterial[j].invoiceid = "";
                                this.updatetime(invoiceid)
                                let obj = this.props.projectsprovider;
                                this.props.projectsProvider(obj)
                                this.setState({ render: 'render' })
                            }
                        })
                    }
                }
            })
        }
    }

    handlelaboricon(laborid) {
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            let mylabor = this.getmylabor(laborid)
            if (mylabor.invoiceid === invoiceid) {
                return (<button className="btn-removeIcon general-button" onClick={event => { this.removelabor(mylabor.laborid) }}>
                    {removeIcon()}
                </button>)
            }
            else {
                return (<span>&nbsp;</span>)
            }
        }

    }
    showlaborid(mylabor) {

        return (
            <div className="general-flex">
                <div className="flex-7" onClick={event => { this.addlabor(mylabor.laborid) }}>
                    <span className="regularFont">{mylabor.description}</span> <br />
                    <span className="regularFont">From {inputUTCStringForLaborID(mylabor.timein)} to {inputUTCStringForLaborID(mylabor.timeout)}</span><br />
                    <span className="regularFont">${Number(mylabor.laborrate).toFixed(2)}/Hr x {calculatetotalhours(mylabor.timeout, mylabor.timein)} Hrs = ${(Number(calculatetotalhours(mylabor.timeout, mylabor.timein)) * Number(mylabor.laborrate)).toFixed(2)}</span>
                </div>
                <div className="flex-1 align-contentCenter">
                    {this.handlelaboricon(mylabor.laborid)}

                </div>

            </div>
        )

    }
    showmaterialid(mymaterial) {
        return (<div className="general-flex">
            <div className="flex-7" ame="laborid-icon" onClick={event => { this.addmaterial(mymaterial.materialid) }}>

                <span className="regularFont">{inputUTCStringForMaterialIDWithTime(mymaterial.timein)}</span><br />
                <span className="regularFont">{mymaterial.description}</span><br />
                <span className="regularFont">{mymaterial.quantity} {mymaterial.unit} ${mymaterial.unitcost} = ${(mymaterial.quantity * mymaterial.unitcost).toFixed(2)}</span>

            </div>
            <div className="flex-1 align-contentCenter">
                {this.handlematerialicon(mymaterial.materialid)}
            </div>
        </div>)
    }
    async saveallprojects() {
        let providerid = this.props.myusermodel.providerid;
        let projectid = this.props.projectid.projectid;
        let myproject = this.getproject();

        let values = { providerid, projectid, myproject }

        let response = await ProviderEndPoint(values);
        console.log(response)
        if (response.hasOwnProperty("projectsprovider")) {
            let updatedproject = response.projectsprovider.myproject[0];
            if (this.props.projectsprovider.hasOwnProperty("length")) {
                // eslint-disable-next-line
                this.props.projectsprovider.map((myproject, i) => {
                    if (myproject.projectid === projectid) {
                        this.props.projectsprovider[i] = updatedproject;
                        let obj = this.props.projectsprovider;
                        this.props.projectsProvider(obj);
                        let dateupdated = inputUTCStringForLaborID(response.dateupdated)
                        this.setState({ message: `${response.message} Last Updated ${dateupdated}`, activeinvoiceid: this.searchresponseforactiveid(response) })


                    }
                })
            }
        }

    }
    searchresponseforactiveid(response) {
        let activeinvoiceid = this.state.activeinvoiceid;
        let invoiceid = "";
        if (activeinvoiceid) {
            let myproject = response.projectsprovider.myproject[0];
            if (myproject.hasOwnProperty("proposals")) {
                // eslint-disable-next-line
                myproject.invoices.myinvoice.map(myinvoice => {
                    if (myinvoice.invoiceid === activeinvoiceid) {
                        invoiceid = activeinvoiceid;
                    }
                })
            }
        }
        return invoiceid;
    }
    getupdated() {
        let updated = "";
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            let myproject = this.getproject();
            if (myproject.hasOwnProperty("proposals")) {
                // eslint-disable-next-line
                myproject.invoices.myinvoice.map(myinvoice => {
                    if (myinvoice.invoiceid === invoiceid) {
                        if (myinvoice.updated) {
                            updated = UTCStringFormatDateforProposal(myinvoice.updated);
                        }
                    }
                })
            }
        }
        if (updated) {
            updated = `Last Updated ${updated}`
        }

        return updated;
    }
    getapproved() {
        let approved = "";
        if (this.state.activeinvoiceid) {
            let invoiceid = this.state.activeinvoiceid;
            let myproject = this.getproject();
            if (myproject.hasOwnProperty("proposals")) {
                // eslint-disable-next-line
                myproject.invoices.myinvoice.map(myinvoice => {
                    if (myinvoice.invoiceid === invoiceid) {
                        if (myinvoice.updated) {
                            approved = UTCStringFormatDateforProposal(myinvoice.approved);
                        }
                    }
                })
            }
        }
        if (approved) {
            approved = `Approved ${approved}`
        }
        return approved;
    }
    render() {
        //PROPOSAL 
        return (
            <div className="proposal-container">
                <div className="proposal-title-row">{this.getprojecttitle()}<br />Invoices </div>
                <div className="proposal-title-row">{this.handletopIcon()} </div>
                <div className="proposal-main-row align-contentCenter">{this.state.invoiceidmsg}</div>
                <div className="proposal-main-row">{this.loadinvoiceids()}</div>
                <div className="proposal-main-row"> {this.loadproposalitems()}</div>
                <div className="proposal-title-row">{this.getupdated()} </div>
                <div className="proposal-title-row">{this.getapproved()} </div>
                <div className="proposal-main-row align-contentCenter">{this.state.message}</div>
                <div className="proposal-title-row"><button className="general-button saveAllProjectsIcon" onClick={event => { this.saveallprojects() }}>{saveallprojectactual()} </button> </div>
            </div>)
    }
}

function mapStateToProps(state) {
    return {
        myusermodel: state.myusermodel,
        projectid: state.projectid,
        projectsprovider: state.projectsprovider,

    }
}
export default connect(mapStateToProps, actions)(MyInvoices)
