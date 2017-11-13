import React from 'react';
import { Container, Row, Col, Card, CardHeader, CardBlock, ListGroup, ListGroupItem } from 'reactstrap';
import RigProblemButton from './ModalButtons/RigProblemButton.jsx';
import PackedWrongRigButton from './ModalButtons/PackedWrongRigButton.jsx';
import { rootURL } from './restInfo.js';
import { toast } from 'react-toastify';

/*

*/
export default class RigAlertsContainer extends React.Component {

    constructor(props) {
        super(props);
        //since the URL section is not directly related to rendering,
        //it shouldn't be part of state. Save it in a class variable.
        this.URLsection = "/reports";

        //Bind all methods that are passed down so that they can
        //be called via this.methodName in child components
        this.pinChanged = this.pinChanged.bind(this);
        this.reportRigIssue = this.reportRigIssue.bind(this);
        this.reportPackingError = this.reportPackingError.bind(this);
        this.validatePIN = this.validatePIN.bind(this);

        var alertData = [{ severity: "Problem Type 1", message: "Rig S9 has a tear on its container" },
        { severity: "Problem Type 2", message: "Rig S4 has a tear on its container" },
        { severity: "Problem Type 3", message: "Rig S1 has this warning listed for it. Uh oh!" }];//get row data from ajax
        var alerts = this.processAlerts(alertData);

        this.state = {
            username: '',
            password: '',
            alerts: alerts
        }
    }


    //This is the function passed down to the password component
    //that's inside the PackButton's verify modal.
    //when the pin is changed, update our state
    pinChanged(id, pin) {
        this.setState({
            pin: pin
        })
        console.log(this.state.pin);
    }

    //When this rigsheet component loads on the page, fetch the rows
    //from the database and display them.
    componentDidMount() {
        this.fetchAlerts();
    }


    //Add a report to the rig.
    //This is passed down to the authorize button inside
    //of the modal that the RigProblemButton creates.
    reportRigIssue(rig, severity, issue) {

        require('isomorphic-fetch');
        require('es6-promise').polyfill();

        var url = rootURL + this.URLsection;

        var self = this;
        var requestVariables = {
            
        };
        fetch(url, {
            method: "POST",
            mode: 'CORS',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestVariables)
        })//when we get a response back
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Adding report failed. Bad response " + response.status + " from server.");
                }
                return response.json();
            })//when the call succeeds
            .then(function (rowData) {
                //create a new alert for the list
                var message = "Rig " + rig + ": " + issue;
                var itemColor = self.getSeverityColor(severity);
                var alert = <ListGroupItem key={self.state.alerts.length + 1}
                    color={itemColor}>{message}</ListGroupItem>

                //grab the current alerts
                var newAlerts = Array.from(self.state.alerts);
                //add our new alert
                newAlerts.push(alert);
                //update the state with the new alerts so it rerenders
                self.setState({
                    alerts: newAlerts
                })
            }).catch(function (error) {
                toast.error(error + "\n" + url);
                return false;
            });
    }

    reportPackingError() {
        console.log("packing error reported");
    }

    //Fetch the reports for rigs from the database and 
    //update the state to display them.
    fetchAlerts() {

        //make sure we have the packages required to
        //make a fetch call (maybe not needed)
        require('isomorphic-fetch');
        require('es6-promise').polyfill();

        //Define our endpoint using the rootURL, the URL section 
        //that we set in our constructor (like "/rigsheets"), and
        //the sheetType prop ("Tandems" or "Students")
        //(rootURL is imported from our rest info file)
        var url = rootURL + this.URLsection;

        //save 'this' so that we can call functions
        //inside the fetch() callback
        var self = this;

        //fetch from the specified URL, to GET the data
        //we need. Enable CORS so we can access from localhost.
        fetch(url, {
            method: "GET",
            mode: 'CORS',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })//when we get a response back
            .then(function (response) {
                //check to see if the call we made failed
                //if it failed, throw an error and stop.
                if (response.status >= 400) {
                    throw new Error("Fetching alerts failed. Bad response " + response.status + " from server.");
                }
                //if it didn't fail, process the data we got back
                //into JSON format
                return response.json();
            })//when the call succeeds
            .then(function (alertData) {
                //process the row data we received back
                self.processAlerts(alertData);
                //update our state with these rows to rerender the table
                self.setState({
                    alerts: alertData
                });
            }).catch(function (error) {
                toast.error(error + "\n" + url);
                return false;
            });
    }

    processAlerts(alertData) {
        var alerts = [];
        for (var i = 0; i < alertData.length; i++) {
            var itemColor = this.getSeverityColor(alertData[i].severity);
            var nextAlert = <ListGroupItem
                key={i}
                color={itemColor}>
                {alertData[i].message}
            </ListGroupItem>
            alerts.unshift(nextAlert);
        }
        return alerts;
    }

    getSeverityColor(severity) {
        var color = "primary";
        switch (severity) {
            case ("Problem Type 1"):
                color = "info";
                break;
            case ("Problem Type 2"):
                color = "warning";
                break;
            case ("Problem Type 3"):
                color = "danger";
                break;
            case ("Problem Type 4"):
                color = "danger";
                break;
            default:
                color = "secondary"
                break;
        }
        return color;
    }

    //Validates the given PIN
    //Returns true if they are valid for this action,
    //and false otherwise.
    validatePIN(PIN) {
        //OBVIOUSLY THIS DOESN'T DO ANYTHING RIGHT NOW
        this.setState({
            pin: ''
        });
        return true;
    }

    render() {
        return (
            <Container fluid>
                <Card>
                    <CardHeader>Reports</CardHeader>
                    <CardBlock>
                        <Row>
                            <Col lg={{ size: 6 }}>
                                <ListGroup >
                                    {this.state.alerts}
                                </ListGroup>
                            </Col>
                            <Col lg={{ size: 6 }}>

                                <RigProblemButton
                                    pinChanged={this.pinChanged}
                                    verify={this.reportRigIssue} />
                                <br />
                                <PackedWrongRigButton
                                    pinChanged={this.pinChanged}
                                    verify={this.reportPackingError} />
                            </Col>
                        </Row>
                    </CardBlock>
                </Card>
            </Container>
        );
    }
}