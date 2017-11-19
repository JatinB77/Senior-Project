import React from 'react';
import { Row, Col, Card } from 'reactstrap';
import RentalTable from '../Tables/RentalTable.jsx';
import BlankItemDisplay from '../ItemDisplays/BlankItemDisplay.jsx';
import 'bootstrap/dist/css/bootstrap.css';

const marginStyle = {
    marginTop: 25,
    marginBottom: 25
};

class RentalScreen extends React.Component {

    constructor(props) {
        super(props);

        this.displayChange = this.displayChange.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);

        this.state = {
            currentItem: <BlankItemDisplay headerText={"Rental Item Details"}/>
        }
    }

    //changes the display of the right side of the screen by
    //taking in a RentalItemDisplay and setting it in the currentItem state
    displayChange(itemDisplay, rowID) {
        if (itemDisplay) {
            this.setState({
                currentItem: itemDisplay
            })
        } else {

        }
    }

    resetDisplay() {
        this.setState({
            currentItem: <BlankItemDisplay headerText={"Rental Item Details"}/>
        });
    }

    render() {
        return (
            <div>
                <Row style={marginStyle}>
                    <Col lg={{ size: 5, offset: 1 }}>
                        <RentalTable displayChange={this.displayChange} resetDisplay={this.resetDisplay}/>
                    </Col>
                    <Col lg={{ size: 5}}>
                        <Card body>
                            {this.state.currentItem}
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
};

//<RentButton buttonText="Rent" disabled={true} />

export default RentalScreen;
