import React from 'react';
import gql from "graphql-tag";
import { graphql, withApollo, compose, Query } from "react-apollo";
import ExerciseTemplates from './ExerciseTemplates';
import RoutineTemplates from './RoutineTemplates';
import PrivateHeader from './PrivateHeader';
import Workout from './Workout';
import ProgressPage from './ProgressPage';
import {
  WORKOUT_PAGE, ROUTINES_PAGE, EXERCISES_PAGE, PROGRESS_PAGE
} from '../../startup/client/constants';

const getMostRecentRoutine = gql`
    query getMostRecentRoutine{
        getMostRecentRoutine{
            _id
            name
            logged
            startTime
            endTime
            exercises{
                _id
                startTime
                endTime
                sets{
                    _id
                    weight
                    reps
                    setNumber
                    orm
                }
                previousExercise {
                  sets{
                    weight,
                    reps,
                    setNumber,
                    orm
                  }
                }
            }
        }
    }
`;


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
        <PrivateHeader {...this.props} page={page} onPageChange={this.onPageChange} title="Workout Dashboard"/>
        <div className="page-content">
          {page === WORKOUT_PAGE &&
            <Query query={getMostRecentRoutine}>
              {({loading, error, data}) => {
                if (loading) return <div>Loading</div>;
                if (error) return <div>{error}</div>;
                return (
                  <Workout routineTemplates={routineTemplates} routines={routines} getMostRecentRoutine={data.getMostRecentRoutine}  exerciseTemplates={exerciseTemplates}/>
                )
              }}
            </Query>
          }
          {page === ROUTINES_PAGE &&
            <RoutineTemplates loading={loading} exerciseTemplates={exerciseTemplates} routineTemplates={routineTemplates}/>
          }
          {page === EXERCISES_PAGE &&
            <ExerciseTemplates loading={loading} tags={tags} exerciseTemplates={exerciseTemplates}/>
          }
          {page === PROGRESS_PAGE &&
            <ProgressPage loading={loading} exerciseTemplates={exerciseTemplates}/>

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
        topExerciseStats {
          topORM
        }
        exercises {
          _id
          startTime
          endTime
          exerciseStats {
            topORM
            totalWeight
            totalReps
          }
        }
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
      logged
      startTime
      endTime
      exercises {
        _id
        name
        startTime
        endTime
        sets {
          _id
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
}))(withApollo(Dashboard));

// ,graphql(getMostRecentRoutine, {
//   props: ({ data }) => ({ ...data })
// })
