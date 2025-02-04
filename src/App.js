import React from "react";

import Home from './Home'
import Form from './Form.js'
import Nav from './nav.js'
import './App.css'
import {Route, Switch} from 'react-router-dom'
import * as yup from 'yup'
import formSchema from './formSchema.js'
import axios from 'axios'


const initialFormValues = {
  name: '',
  size: '',
  pepperoni: false,
  olives: false,
  onions: false,
  peppers: false,
  instructions: ''
}
const initialFormErrors = {
  name: 'Name is required.',
  size: 'Size is required.',
}



const App = () => {
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(true)

  const postPizza = pizza => {
    axios.post('https://reqres.in/api/pizza', pizza)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log(err);
      })
      setFormValues(initialFormValues)
  }

  const inputChange = (name, value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => {setFormErrors({...formErrors, [name]: ''})})
      .catch(err => {setFormErrors({...formErrors, [name]: err.errors[0]})})
    setFormValues({
      ...formValues,
      [name]: value
    })
  }
  const formSubmit = () => {
    const pizza = {
      name: formValues.name.trim(),
      size: formValues.size.trim(),
      toppings: ['pepperoni', 'olives', 'onions', 'peppers'].filter(topping => formValues[topping])
    }
    postPizza(pizza)
  }
  useEffect(() => {
    formSchema.isValid(formValues).then(valid => setDisabled(!valid))
  }, [formValues])
  return (
    <>
      <h1>Lambda Eats</h1>
      <p>You can remove this code and create your own header</p>
    <Switch>
      <Route path="/pizza">
        <Nav />
        <Form values={formValues} change={inputChange} submit={formSubmit} errors={formErrors} disabled = {disabled}/>
      </Route>
      <Route path="/">
        <Nav />
        <Home/>
      </Route>
    </Switch>

    </>
  );
};
