import React from 'react';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import Cancel from '@material-ui/icons/Cancel';
import AddCircle from '@material-ui/icons/AddCircle';
import { rabinKarp } from '../../startup/client/utils';
import Chip from '../Components/Chip';

const createTag = gql`
    mutation createTag($name: String!){
        createTag(name: $name){
            _id,
            name
        }
    }
`

class AddTag extends React.Component{
    constructor(props){
        super(props)
        this.state ={
            searchTag: ""
        }
    }

    updateSearchTag = (e) => {
        e.preventDefault();
        this.setState({searchTag: e.target.value})
    }

    saveTag = () => {
        this.props.createTag({
            variables: {
                name: this.state.searchTag
            }
        }).then(({data}) => {
            console.log('createTag', data)
            const newTag = {
                name: data.createTag.name,
                _id: data.createTag._id
            }
            this.props.selectTag(newTag);
        }).catch(error => {
            console.log('saveTag');
            console.log(error)
        })
    }

    render(){
        const {searchTag} = this.state;
        const {tags, selectTag, closeAddTagModal} = this.props;
        const parsedTags = tags ? tags.filter(tag => rabinKarp(searchTag.toLowerCase(), tag.name.toLowerCase())) : [];
        const canCreate = parsedTags.reduce((accum, tag) => (accum && searchTag.toLowerCase() !== tag.name.toLowerCase()), true) && searchTag.length > 2;
        return (
            <div className="boxed-view boxed-view--modal">
                <div className="page-content page-content--modal">
                    <div className="boxed-view__box boxed-view--modal-item modal--center-text">
                        <form noValidate className="boxed-view__form" style={{zIndex: 8}}>
                            <h2>Tags</h2>
                            <div style={{display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: 'center'}}>
                                <input type="text" style={{marginTop: "1.4rem"}} value={searchTag} onChange={this.updateSearchTag} placeholder="Search Tags"/>
                                <AddCircle onClick={() => {if (canCreate) this.saveTag()}} className={`icon ${canCreate ? "" : "icon--disabled"}`}/>
                            </div>
                            <div>
                                {parsedTags.map(tag => (
                                    <Chip handleClick={() => {selectTag(tag)}} value={tag} name={tag.name} />
                                ))}
                            </div>
                        </form>
                        <div className="modal__cancel-box">
                            <Cancel onClick={closeAddTagModal} className="icon"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default graphql(
    createTag, {
        name: "createTag",
        options: {
            refetchQueries: "Tags"
        }
    }
)(AddTag);