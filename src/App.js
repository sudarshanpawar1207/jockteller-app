import React, { Component } from 'react' 
import {Formik,Form,Field} from 'formik'

import axios from 'axios'
  
class Joke extends Component 
{         
    constructor(props)
    {
        super(props)
        this.state = {
            data : {},

            jokeData : false,
            ansButton : [],
            urlData : 'https://v2.jokeapi.dev/joke/Any'          
        }       
    }

    componentDidMount()
    {
        axios.get('https://v2.jokeapi.dev/info')
            .then(async response => {
                // console.log(response.data.jokes.idRange)
                this.setState({data : response.data.jokes.idRange})
            })
            .catch(error => console.log(error))
    }

    buttonHandler(index)
    { 
        // console.log(index)
        if(index === -1)
        {
            // console.log(this.state.ansButton)
            this.setState({ansButton : false})
        }
        else
        {
            const tempArray = this.state.ansButton

            for(let i=0 ; i<tempArray.length ; i++)
            {
                if(i===index)
                {
                    tempArray[i] = false
                }
            }

            this.setState({ansButton : tempArray})
        }        
    }

    render() 
    {
        return (
            <div>
                <Formik
                    initialValues = {{
                        category : 'Any',
                        disabledValue : true,
                        customCategory : [],
                        language : 'en',
                        blacklistFlags : [],
                        format : 'json',
                        type : [true,true],
                        contains : '',
                        rangeStart : 0,
                        rangeEnd : 1368,
                        maxLength : 1368,
                        amount : 1,
                        basicUrl : 'https://v2.jokeapi.dev/joke/Any'
                    }}

                    onSubmit = {async (values) =>  {
                        // console.log(values.basicUrl)
                        axios.get(values.basicUrl)
                            .then(response => {
                                // console.log(response.data)
                                this.setState({jokeData : response.data})
                                response.data.amount ? this.setState({ansButton : Array(response.data.amount).fill(true)}) : this.setState({ansButton : true})
                            })
                            .catch(error => console.log(error))
                    }}

                    validate = { async (values) => {
                        // console.log(values.rangeEnd)
                        // console.log(values.blacklistFlags.length)
                        let jokeType = ''
                        if(values.type[0]!==values.type[1])
                        {
                            if(values.type[0]===true)
                            {
                                jokeType='single'
                            }
                            else
                            {
                                jokeType='twopart'
                            }
                        }
                        if((values.rangeStart>0 && values.rangeStart<values.maxLength) || (values.rangeEnd>0 && values.rangeEnd<values.maxLength))
                        {
                            // console.log(values.rangeStart,'---',values.rangeEnd)
                        }
                        
                        let count=0
                        const temp = () => {                                                  // to concatenate URL
                            if(count===0)
                            {
                                count=1
                                return "?"
                            }
                            else
                            {
                                return "&"
                            }
                        }

                        // console.log(values.rangeStart,'-',values.rangeEnd)
                        // ${values.rangeStart!==this.state.data[values.language][0]&&values.rangeEnd!==this.state.data[values.language][1] ? '?idRange='+values.rangeStart-values.rangeEnd : ''}
                    
                        values.basicUrl = `https://v2.jokeapi.dev/joke/${values.category==='Any' ? 'Any' : values.customCategory}${values.language!=='en' ? temp()+'lang='+values.language : ''}${values.blacklistFlags.length!==0 ? temp()+'blacklistFlags='+values.blacklistFlags : ''}${values.format!=='json' ? temp()+'format='+values.format : ''}${values.type[0]!==values.type[1] ? temp()+'type='+jokeType : ''}${values.contains!=='' ? temp()+'contains='+values.contains : ''}${ (values.rangeStart>0 && values.rangeStart<values.maxLength) || (values.rangeEnd>0 && values.rangeEnd<values.maxLength) ? temp()+'idRange='+values.rangeStart+'-'+values.rangeEnd : ''}${values.amount!==1 ? temp()+'amount='+values.amount : ''}`   
                        // console.log(values.basicUrl)   

                        this.setState({urlData : values.basicUrl})
                                
                        let errors = {}
                        return errors
                    }}
                >
                    {
                        (formik) => {
                            return <Form>
                                <div className='container m-1' style={{color:'white'}}>
                                    
                                    <h1 className='text-center'>Joke Teller</h1>

                                    {/* {console.log('Formik data',formik.values)} */}

                                    <div className='container m-5 p-3' style={{border:'2px white solid',borderRadius:'10px',backgroundColor:'rgb(44,44,46)'}}>

                                        <div className='container m-2' style={{display:'inline-flex'}}>
                                            <div className='container col-3'>
                                                <h6>Select category / categories:</h6>
                                            </div>
                                            <div className='container col-9' style={{border:'1px solid',borderRadius:'5px',borderColor:formik.values.category!=='Any'&&formik.values.customCategory.length===0?'red':'white'}} >
                                                <label>
                                                    <Field type="radio" name="category" value="Any" data-testid="Any" onClick = {() => {
                                                            // console.log(formik.values.disabledValue)
                                                            const prevValue = formik.values.disabledValue
                                                            formik.values.disabledValue = !prevValue
                                                        }}  
                                                    />Any
                                                </label>
                                                <br />
                                                <div className='container p-0' style={{display:'inline-flex'}}>
                                                    <label>
                                                        <Field type="radio" name="category" value="Custom" data-testid="Custom" onClick = {() => {
                                                                // console.log(formik.values.disabledValue)
                                                                const prevValue = formik.values.disabledValue
                                                                formik.values.disabledValue = !prevValue
                                                            }} 
                                                        />Custom
                                                    </label>
                                                    <div>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Programming" disabled = {formik.values.disabledValue} data-testid="Programming" />Programming
                                                        </label>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Miscellaneous" disabled = {formik.values.disabledValue} data-testid="Misc" />Misc
                                                        </label>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Dark" disabled = {formik.values.disabledValue} data-testid="Dark" />Dark
                                                        </label>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Pun" disabled = {formik.values.disabledValue} data-testid="Pun" />Pun
                                                        </label>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Spooky" disabled = {formik.values.disabledValue} data-testid="Spooky" />Spooky
                                                        </label>
                                                        <label>
                                                            <Field type="checkbox" name="customCategory" value="Christmas" disabled = {formik.values.disabledValue} data-testid="Christmas" />christmas
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> <br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3' >
                                                <h6>Select language:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px white solid',borderRadius:'5px'}} >
                                                <Field component="select" id="language" name="language" data-testid="select-option"
                                                    onClick = {() => {
                                                        // console.log(formik.values.language)
                                                        // console.log(this.state.data[formik.values.language][0])
                                                        // console.log(data.formik.values.language)
                                                        this.state.data !== {} ? formik.values.rangeStart = this.state.data[formik.values.language][0] : formik.values.rangeStart = 0
                                                        this.state.data !== {} ? formik.values.rangeEnd = this.state.data[formik.values.language][1] : formik.values.rangeEnd = 1368
                                                        this.state.data !== {} ? formik.values.maxLength = this.state.data[formik.values.language][1] : formik.values.maxLength = 1368
                                                    }} 
                                                >
                                                    <option value="cs">cs-Czech</option>
                                                    <option value="de">de-German</option>
                                                    <option value="en">en-English</option>
                                                    <option value="es">es-Spanish</option>
                                                    <option value="fr">fr-French</option>
                                                    <option value="pt">pt-Portuguese</option>
                                                </Field>
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3'>
                                                <h6>Select flags to blacklist:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px white solid',borderRadius:'5px'}}>
                                                <label>(Optional)</label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="nsfw" data-testid='nsfw' />nsfw
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="religious" data-testid='religious' />religious
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="political" data-testid='political' />political
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="racist" data-testid='racist' />racist
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="sexist" data-testid='sexist' />sexist
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="blacklistFlags" value="explicit" data-testid='explicit' />explicit
                                                </label>       
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}}>
                                            <div className='container col-3'>
                                                <h6>Select response format:</h6>
                                            </div>
                                            <div className='container col-9' style={{border:'1px white solid',borderRadius:'5px'}}>
                                                <label>
                                                    <Field type="radio" name="format" value="json" />default(json)
                                                </label>
                                                <label>
                                                    <Field type="radio" name="format" value="xml" />xml
                                                </label>
                                                <label>
                                                    <Field type="radio" name="format" value="yaml" />yaml
                                                </label>
                                                <label>
                                                    <Field type="radio" name="format" value="txt" />plain text
                                                </label>
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3'>
                                                <h6>Select at least one joke type:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px solid',borderRadius:'5px',borderColor:formik.values.type[0]===false&&formik.values.type[1]===false?'red':'white'}} >
                                                <label>
                                                    <Field type="checkbox" name="type[0]" data-testid='single'  />single
                                                </label>
                                                <label>
                                                    <Field type="checkbox" name="type[1]" data-testid='twopart' />twopart
                                                </label>      
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3'>
                                                <h6>Search for a joke that contains this search string:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px white solid',borderRadius:'5px'}}>
                                                <Field id="ccontains" data-testid="searchString" name="contains" placeholder="(optional)" style={{width:"100%"}}/>    
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3'>
                                                <h6>Search for a joke in this ID range:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px solid',borderRadius:'5px',borderColor:formik.values.rangeStart==='' || formik.values.rangeEnd==='' || formik.values.rangeStart<0 || formik.values.rangeStart>formik.values.maxLength || formik.values.rangeEnd<0 || formik.values.rangeEnd>formik.values.maxLength ?'red':'white'}}>
                                                <label>(Optional)</label>
                                                <label>
                                                    From:<Field type='number' id="rangeStart" name="rangeStart" style={{width:"100px"}} min='0' max={formik.values.maxLength}  />
                                                </label>
                                                <label>
                                                    To:<Field type='number' id="rangeEnd" name="rangeEnd" style={{width:"100px"}} min='0' max={formik.values.maxLength} />
                                                </label>
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{display:'inline-flex'}} >
                                            <div className='container col-3'>
                                                <h6>Amount of jokes:</h6>
                                            </div>
                                            <div className='container col-9 p-1' style={{border:'1px solid',borderRadius:'5px',borderColor:formik.values.amount===''|| formik.values.amount<1 || formik.values.amount>10 ?'red':'white'}}>
                                                <Field type="number" id="amount" name="amount" style={{width:"100px"}} min='1' max='10' data-testid='amoutOfJokes' />
                                            </div>
                                        </div><br /> <br/>

                                        <div className='container m-2' style={{border:'1px white solid',borderRadius:'5px'}} >
                                            <div style={{display:'inline-flex'}}>
                                                {/* <h6>{formik.values.basicUrl}</h6> */}
                                                <h6>URL : </h6><h6 style={{marginLeft:'10px'}}>{this.state.urlData}</h6>
                                            </div>
                                            <br />
                                            <div className='container m-1'>
                                                <button type='reset' onClick={()=>this.setState({urlData : 'https://v2.jokeapi.dev/joke/Any'})}>Reset Form</button>
                                                <button type='submit' style={{marginLeft:"20px"}}>Send Request</button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>  
                            </Form>
                        }
                    }
                </Formik>

                <div className='container m-5 p-2' style={{backgroundColor:'cyne',borderRadius:'10px',borderLeft:'10px purple solid'}}>
                    
                    <h5 style={{marginLeft:"30px"}}>Result</h5>
                    
                    <div className='container' style={{height:'5px',width:'100%',backgroundColor:'purple'}} ></div>
                  
                    { 
                        this.state.jokeData!==false ? 
                            this.state.jokeData.amount ?
                                this.state.jokeData.jokes.map((jokeItem,jokeIndex) => {
                                    return <div key={jokeIndex}>
                                        {
                                           
                                            jokeItem.type==='single' ? 
                                                <div><p>{jokeItem.joke}</p></div> : 
                                                <div>
                                                    <div>{jokeItem.setup}</div>
                                                    <br />
                                                    {this.state.ansButton[jokeIndex] === true ?
                                                    <button onClick={()=>this.buttonHandler(jokeIndex)}>Show answer</button> :
                                                    <div>{jokeItem.delivery}</div>}
                                                </div>
                                        }  
                                        { jokeIndex!==this.state.jokeData.amount-1 && <hr />}
                                    </div>
                                    }) :
                                    <div>
                                        {
                                            this.state.jokeData.type==='single' ? 
                                                <div><p>{this.state.jokeData.joke}</p></div> : 
                                                <div>
                                                    <div>{this.state.jokeData.setup}</div>
                                                    <br />
                                                    {this.state.ansButton === true ?
                                                    <button onClick={()=>this.buttonHandler(-1)}>Show answer</button> :
                                                    <div>{this.state.jokeData.delivery}</div>}
                                                </div>
                                        }
                    	                </div> :
                                <h6>(Set parameters and click "Send Request" above)</h6>
                    }

                </div>

                <div className='Container' style={{height:"10px"}}></div>

            </div>

        
        )
    }
}

export default Joke