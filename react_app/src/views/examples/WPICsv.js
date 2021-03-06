/*!

=========================================================
* BLK Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Featureswpi from './Featureswpi.js';
import Featureswpipred from './Featureswpipred.js'
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  FormText,
} from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footer/Footer.js";
import { withWindowState } from 'react-window-state';

class WPICsv extends React.Component {
  state = {
    data : [],
    pred_data : [],
    xlxs_file: "Upload XLXS File", 
    ods_file: "Upload  ODS File",
    canvas_width: 1000 / 1792 * window.innerWidth,
    canvas_height: 0.6 * window.innerHeight,
    threshold : -1.5,
    type: "features",
    is_graph: "false"
  };
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this); 
  }

  static getDerivedStateFromProps(props, current_state) {
    if (current_state.canvas_width !== props.win.width * 1000 / 1792 || current_state.canvas_height !== props.win.height * 550 / 716) {
      return {
        canvas_width: props.win.width * 1000 / 1792,
        canvas_height: props.win.height * 0.6
      }
    }
    return null
  }

  handleSubmit() {
    var url = "/calculate_wpi_csv";
    const data = new FormData();
    Object.keys(this.state.data).forEach(key => data.append(key, this.state.data[key]))
    const requestOptions = {
      method: 'POST',
      // headers: {'Content-Type': 'application/json'},
      body: data,
    };
    // for(var key of requestOptions['body'].entries())
    // {
    //   console.log(key[0], "F", key[1]);
    // }
    console.log(this.state.data);
    console.log(data.get("name"));
    console.log("url ^^^");
    fetch(url, requestOptions)
    .then(response => {
        console.log("received");
        console.log(response);
        console.log("done");
        // for(var key in response){
        //   console.log(key, response[key])
        // }
    });
   // this.load_indices();
  }



  load_indices() {
    var url = `/get_wpi_csv`
    fetch(url, {
        method: 'GET',
    })
        .then(response => {
            console.log('response is', response);
            return response.json();
        })
        .then(res => {
            var data = [];
            var pred_data = [];
            for (var i = 0; i < res.dates.length; i++) {
                data.push({ 'date': res.dates[i], 'wpi': res.wpi[i]});
                pred_data.push({ 'date': res.dates[i], 'wpi': res.wpi[i], 'wpipred': res.pred[i]});

            }
            console.log(data);
            this.setState({ data: data, pred_data: pred_data, is_graph: "true"});
        })
        .catch(error => console.log(error)
        );
  }


  uploadFile(file, is_xlsx) {
    var url;
    if (is_xlsx) {
        this.setState({ xlxs_file: file.name });
        url = '/send_wpi_xlxs';
    }
    else {
        this.setState({ ods_file: file.name });
        url = '/send_wpi_ods';
    }
    
    var formData = new FormData();

    formData.append('file', file);
    
    fetch(url, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(success => {
            console.log('success is', success);
            if (!is_xlsx) {
                this.load_indices();
            }
        })
        .catch(error => console.log(error)
        );
  }

  handleTypeChange = (e) => {
    this.setState({type:e.target.value});
  }

  onChange(e) {
    if(e.target.id === 'nameField') {
      let newState = Object.assign({}, this.state.data);
      newState['name'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'typeField') {
      let newState = Object.assign({}, this.state.data);
      newState['type'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'descriptionField') {
      let newState = Object.assign({}, this.state.data);
      newState['description'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'challengeField') {
      let newState = Object.assign({}, this.state.data);
      newState['challenge'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'hintField') {
      let newState = Object.assign({}, this.state.data);
      newState['hint'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'solutionField') {
      let newState = Object.assign({}, this.state.data);
      newState['solution'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'levelField') {
      let newState = Object.assign({}, this.state.data);
      newState['level'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'allowEncryptField') {
      let newState = Object.assign({}, this.state.data);
      newState['allow_encrypt'] = e.target.value;
      this.setState({data : newState});
    }
    else if(e.target.id === 'allowDecryptField') {
      let newState = Object.assign({}, this.state.data);
      newState['allow_decrypt'] = e.target.value;
      this.setState({data : newState});
    }
    else {
      let newState = Object.assign({}, this.state.data);
      newState['selectedFile'] = e.target.files[0];
      console.log(newState['selectedFile'])
      this.setState({data : newState});
    }
  }
  componentDidMount() {
    document.body.classList.toggle("index-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("index-page");
  }
  render() {
    return (
      <>
        <IndexNavbar />
        <div className="wrapper">
            <div className="section section-signup">
            <Container>
              <div className="squares square-1" />
              <div className="squares square-2" />
              <div className="squares square-3" />
              <div className="squares square-4" />
              <Row className="row-grid justify-content-between align-items-center">
                <Col className="mb-lg-auto" lg="4">
                  <h2 className="title">Calculate WPI for CSV</h2>
                  <Card className="card-register">
                    <CardBody>
                      <Form className="form" onSubmit = {this.handleSubmit}>
                      <FormGroup>
                        <Label for="xlsxFile">
                            <h4><Button
                              className="btn-icon btn-round"
                              color="primary"
                              type="button"
                            >
                              <i className="tim-icons icon-cloud-upload-94" />
                            </Button>  {this.state.xlxs_file}</h4> 
                          </Label>
                          <Input
                            type="file"
                            name="file"
                            id="xlsxFile"
                            style={{ cursor: 'pointer' }}
                            onChange={(e) => this.uploadFile(e.target.files[0], true)}
                            />
                        </FormGroup>

                      <FormGroup>  
                        <Label for="odsFile">
                            <h4><Button
                              className="btn-icon btn-round"
                              color="primary"
                              type="button"
                            >
                              <i className="tim-icons icon-cloud-upload-94" />
                            </Button>  {this.state.ods_file}</h4> 
                          </Label>
                          <Input
                            type="file"
                            name="file"
                            id="odsFile"
                            style={{ cursor: 'pointer' }}
                            onChange={(e) => this.uploadFile(e.target.files[0], false)}
                            />
                        </FormGroup>

                        <FormGroup>
                          <Label for="displayOption">Select display option</Label>
                          <div>
                          <select  style={{textAlignLast : "center", borderRadius: "1em", background : "transparent", width: "280px", color : "inherit", height : "20px"}} onChange={this.handleTypeChange}
                            type="text"
                            name="level"
                            id="displayOption"
                            style={{ cursor: 'pointer', textAlign: 'center', borderRadius: "1em",width: "280px", color : "inherit",  height : "30px"}}
                            required
                          >
                          <option value="features">WPI Values</option>
                          <option value="pred">WPI Values & Prediction</option>
                          </select> 
                          </div>
                        </FormGroup><br></br>

                      </Form>
                    </CardBody>
                  </Card>
                </Col>                
                <Col className="mb-lg-auto" lg="8">
                      {this.state.is_graph == "true" &&  this.state.type === "pred" && <Featureswpipred data={this.state.pred_data} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                      {this.state.is_graph == "true" && this.state.type === "features" && <Featureswpi data={this.state.data} width={this.state.canvas_width} height={this.state.canvas_height}/>}
                   </Col>
              </Row>
            </Container>
            </div>
        </div>
      </>
    );
  }
}

export default withWindowState(WPICsv);