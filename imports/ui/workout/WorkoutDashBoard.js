import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo, compose } from "react-apollo";
import ExerciseTemplates from './ExerciseTemplates';
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
    const {exerciseTemplates, loading, routineTemplates, tags, routines} = this.props;
    const {page} = this.state;
    if (loading) return <div>Loading</div>
    return (
      <div className="backdrop">
        <PrivateHeader {...this.props} onPageChange={this.onPageChange} title="Workout Dashboard"/>
        <div className="page-content">
          {page === WORKOUT_PAGE &&
            <Workout routineTemplates={routineTemplates} routines={routines}/>
          }
          {page === ROUTINES_PAGE &&
            <Routines loading={loading} exercises={exerciseTemplates} routineTemplates={routineTemplates}/>
          }
          {page === EXERCISES_PAGE &&
            <ExerciseTemplates loading={loading} tags={tags} exerciseTemplates={exerciseTemplates}/>
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

const routinesQuery = gql`
  query Routines {
    routines {
      _id
      name
      exercises {
        _id
        sets {
          weight
          reps
          orm
          setNumber
        }
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
}), graphql( routinesQuery, {
  props: ({ data }) => ({ ...data })
}) 
)(withApollo(Dashboard));
