import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import Exercises from './Exercises';
import Routines from './Routines';
import PrivateHeader from './PrivateHeader';
import Workout from './Workout';
import {
  WORKOUT_PAGE, ROUTINES_PAGE, EXERCISES_PAGE
} from '../../startup/client/constants';

class Dashboard extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      page: WORKOUT_PAGE
    }
    
  }

  onPageChange = (page) => {
    this.setState({page})
  }

  render(){
    const {exerciseTemplates, loading, routineTemplates, tags} = this.props;
    const {page} = this.state;
    return (
      <div className="backdrop">
        <PrivateHeader {...this.props} onPageChange={this.onPageChange} title="Workout Dashboard"/>
        <div className="page-content">
          {page === WORKOUT_PAGE &&
            <Workout />
          }
          {page === ROUTINES_PAGE &&
            <Routines loading={loading} exercises={exerciseTemplates} routineTemplates={routineTemplates}/>
          }
          {page === EXERCISES_PAGE &&
            <Exercises loading={loading} tags={tags} exerciseTemplates={exerciseTemplates}/>
          }
        </div>
      </div>
    );
  }
};

const exerciseTemplatesQuery = gql`
    query ExerciseTemplates {
    exerciseTemplates {
        _id
        name
        tags{
          name
          _id
        }
    }
}
`;
const routineTemplatesQuery = gql`
    query RoutineTemplates {
    routineTemplates {
        _id
        name
        exerciseTemplates {
          _id
          name
        }
    }
}
`;

const tagsQuery = gql`
  query Tags{
    tags {
      _id,
      name
    }
  }
`;
export default compose (graphql(exerciseTemplatesQuery, {
  props: ({ data }) => ({ ...data })
}), graphql(routineTemplatesQuery, {
  props: ({ data}) => ({...data})
}), graphql(tagsQuery , {
  props: ({data}) => ({...data})
}
))(withApollo(Dashboard));
