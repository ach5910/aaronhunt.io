import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import { rabinKarp, formatText } from '../../startup/client/utils';
import api from '../../../secrets/api';

const createTranslation = gql`
    mutation createTranslation($en: String!, $tr: String!){
        createTranslation(en: $en, tr: $tr){
            _id
        }
    }
`;

const translations = gql`
    query translations{
        translations{
            _id
            en
            tr
        }
    }
`;

const TARGET = {
    "en": "tr",
    "tr": "en"
}
class Translator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            "en": "",
            "tr": ""
        }
    }
    onChangeText = (source) => (e) => {
        this.setState({
            [source]: e.target.value
        });
    }

    handleSave = (e) => {
        const {en, tr} = this.state;
        this.props.createTranslation({
            variables: {
                en,
                tr
            }
        }).then(({data}) => {
            console.log('Translation Created', data);
        }).catch((error) => {
            console.log(error);
        })

    }

    
    handleTranslate = (source) => (e) => {
        const {translations} = this.props;
        const text = formatText(this.state[source]);

        const savedTranslations = translations.filter(translation => {
            let formattedSource = formatText(translation[source]);
            return (rabinKarp(formattedSource, text));
        });
        if (savedTranslations && savedTranslations.length > 0) {
            this.setState({[TARGET[source]]: savedTranslations[0][TARGET[source]]});
        } else {
            this.fetchTranslation(text, source);
        }
    }

    fetchTranslation = (text, source) => {
        let url = `https://translation.googleapis.com/language/translate/v2?key=${api.key}`;
        url += '&q=' + encodeURI(text);
        url += `&source=${source}`;
        url += `&target=${TARGET[source]}`;
        fetch(url, { 
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          })
          .then(res => res.json())
          .then((response) => {
            console.log("response from google: ", response);
            this.setState({[TARGET[source]]: response.data.translations[0].translatedText})
          })
          .catch(error => {
            console.log("There was an error with the translation request: ", error);
          });
    }
    render(){
        const {tr, en} = this.state;
        const {loading} = this.props;
        if (loading) return (<div>Loading...</div>)
        return (
            <div className="backdrop">
                <div className="header bg-tr">
                    <div className="header__content">
                        <h1 className="c-wt" style={{marginBottom: "0px"}}>
                            Tercüman
                        </h1>
                    </div>
                </div>
                <div className="page-content--flex">
                    <h1 className="c-tr">
                        English
                    </h1>
                    <textarea style={{marginBottom: "30px"}} type="text" placeholder="Enter text" onChange={this.onChangeText("en")} className="tr-input" value={en}/>
                    <div className="button__container space-evenly">
                        <button onClick={this.handleTranslate("en")} className="button bg-tr">Translate</button>
                        <button onClick={this.handleSave}className="button button--secondary c-tr">Save</button>
                    </div>
                    <h1 className="c-tr" style={{marginTop: "30px"}}>
                        Türk
                    </h1>
                    <textarea style={{marginBottom: "30px"}} type="text" placeholder="Enter text" onChange={this.onChangeText("tr")} className="tr-input" value={tr}/>
                    <div className="button__container space-evenly">
                        <button onClick={this.handleTranslate("tr")} className="button bg-tr">Tercüme</button>
                        {/* <button onClick={this.handleTranslate("tr")}className="button bg-tr">Turkish</button> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(graphql(translations, {
    props: ({ data }) => ({ ...data })
}), graphql(createTranslation, {
    name: "createTranslation",
    options: {
        refetchQueries: ['translations']
    }
})
)(withApollo(Translator));