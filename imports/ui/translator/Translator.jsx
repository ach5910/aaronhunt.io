import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import { rabinKarp, formatText } from '../../startup/client/utils';
import api from '../../../secrets/api';
import { ButtonPrimary, ButtonSecondary } from '../Components/Button';
import SwapIcon from '../Components/SwapIcon';
import ClearIcon from '../Components/ClearIcon';
import EditSVG from '../Components/EditSVG';
import AddSVG from '../Components/AddSVG';

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

const LANG_TEXT = {
    "en": "English",
    "tr": "Türk"
}

const LANG_PLACEHOLDER = {
    "en": "Enter text",
    "tr": "Metin gir"
}
class Translator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            source: "en",
            "en": "",
            "tr": ""
        }
    }
    onChangeText = (source) => (e) => {
        const text = e.target.value;
        this.setState({
            [source]: text,
            translating: true
        });
        this.fetchTranslation(text, source);
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

    
    handleTranslate = (source, rawText) => (e) => {
        const {translations} = this.props;
        const text = rawText ? formatText(rawText) : formatText(this.state[source]);

        const savedTranslations = translations.filter(translation => {
            let formattedSource = formatText(translation[source]);
            return (rabinKarp(formattedSource, text));
        });
        if (savedTranslations && savedTranslations.length > 0) {
            this.setState({[TARGET[source]]: savedTranslations[0][TARGET[source]], translating: false});
        } else {
            this.fetchTranslation(text, source);
        }
    }

    swapSourceLanguage = (e) => {
        this.setState((prevState) => ({
            source: TARGET[prevState.source]
        }))
    }

    clearText = (source) => (e) => {
        if (source === this.state.source){
            this.setState({
                en: "",
                tr: ""
            })
        } else {
            this.setState({
                [source]: ""
            })
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
            this.setState({[TARGET[source]]: response.data.translations[0].translatedText, translating: false})
          })
          .catch(error => {
            console.log("There was an error with the translation request: ", error);
          });
    }
    render(){
        const {tr, en, source, translating} = this.state;
        const {loading, translations} = this.props;
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
                    <div className="translator-box">
                        <div className="translator-header">
                            <div className="translator-title">{LANG_TEXT[source]}</div>
                            <div onClick={this.swapSourceLanguage} className="translator-icon translator-icon--swap">
                                <SwapIcon />
                            </div>
                            <div className="translator-title">{LANG_TEXT[TARGET[source]]}</div>
                        </div>
                        <div className="translator-content-box">
                            <div className="translator-content-wrapper">
                                <textarea 
                                    autoCapitalize={false} 
                                    autoComplete={false} 
                                    autoCorrect={false} 
                                    spellCheck={false} 
                                    className="translator-content" 
                                    type="text" 
                                    placeholder={LANG_PLACEHOLDER[source]} 
                                    onChange={this.onChangeText(source)} 
                                    value={this.state[source]}
                                />
                                {this.state[source] !== "" &&
                                    <div onClick={this.clearText(source)} className="translator-icon translator-icon--clear">
                                        <ClearIcon />
                                    </div>
                                }
                            </div>
                            <div className="translator-content-wrapper">
                                <textarea
                                    autoCapitalize={false} 
                                    autoComplete={false} 
                                    autoCorrect={false} 
                                    spellCheck={false}  
                                    className="translator-content" 
                                    type="text" 
                                    onChange={this.onChangeText(TARGET[source])} 
                                    value={this.state[TARGET[source]]}//value={`${this.state[TARGET[source]]}${translating ? " ..." : ""}`}
                                />
                                {this.state[TARGET[source]] !== "" &&
                                    <React.Fragment>
                                        <div onClick={this.editTranslation} className="translator-icon translator-icon--edit">
                                            <EditSVG />
                                        </div>
                                        <div onClick={this.handleSave} className="translator-icon translator-icon--save">
                                            <AddSVG />
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                    {/* <h1 className="c-tr">
                        English
                    </h1>
                    <textarea style={{marginBottom: "30px"}} type="text" placeholder="Enter text" onChange={this.onChangeText("en")} className="tr-input" value={en}/>
                    <div className="button__container justify-right">
                        <ButtonPrimary handleClick={this.handleTranslate("en")} className="bg-tr" style={{marginRight: "14px"}}>Translate</ButtonPrimary>
                        <ButtonSecondary handleClick={this.handleSave} className="c-tr">Save</ButtonSecondary>
                    </div>
                    <h1 className="c-tr" >
                        Türk
                    </h1>
                    <textarea style={{marginBottom: "30px"}} type="text" placeholder="Enter text" onChange={this.onChangeText("tr")} className="tr-input" value={tr}/>
                    <div className="button__container justify-right">
                        <ButtonPrimary handleClick={this.handleTranslate("tr")} className="bg-tr" style={{marginRight: "14px"}}>Tercüme</ButtonPrimary>
                        <ButtonSecondary handleClick={this.handleSave} className="c-tr">Save</ButtonSecondary>
                    </div> */}
                    <h1 className="c-tr" style={{marginTop: "30px", marginBottom: "14px"}}>
                        Saved Translations
                    </h1>
                    <ul className="translation-list">
                        {translations.map(translation => (
                           <li className="translation-container elevated">
                               <span>
                                    {translation.tr}
                               </span>
                               <span >
                                    {translation.en}
                               </span>
                           </li> 
                        ))}

                    </ul>
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