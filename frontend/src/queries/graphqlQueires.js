import { gql } from "graphql-request";

export const CREATE_FEES_RECORD_MUTATION = gql`
  mutation CreateFeesRecord(
    $studentId: ID!
    $amount: Float!
    $month: String!
    $year: Int!
    $status: String!
  ) {
    createFeesRecord(
      studentId: $studentId
      amount: $amount
      month: $month
      year: $year
      status: $status
    ) {
      id
      amount
      month
      year
      status
    }
  }
`;

export const GET_STUDENT_BY_ID_QUERY = gql`
  query GetStudentById($id: ID!) {
    getStudentById(id: $id) {
      id
      name
      contactInfo
      class
      timeSlot
      joiningDate
      feesRecords {
        id
        amount
        month
        year
        status
      }
    }
  }
`;

export const GET_ALL_STUDENTS_QUERY = `
  query {
    getAllStudents {
      id
      name
      contactInfo
      class
      timeSlot
      joiningDate
    }
  }
`;

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudent($input: CreateStudentInput!) {
    createStudent(input: $input) {
      id
      name
      contactInfo
      class
      timeSlot
    }
  }
`;

// export const DELETE_FEES_RECORD_MUTATION = gql`
//   mutation DeleteFeesRecord($id: ID!) {
//     deleteFeesRecord(id: $id) {
//       id
//       message
//     }
//   }
// `;

export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id)
  }
`;