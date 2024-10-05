import { gql } from "graphql-request";

export const CREATE_FEES_RECORD_MUTATION = gql`
  mutation CreateFeesRecord(
    $studentId: ID!
    $amount: Float!
    $date_of_payment: Date!
    $status: String!
  ) {
    createFeesRecord(
      studentId: $studentId
      amount: $amount
      date_of_payment: $date_of_payment
      status: $status
    ) {
      id
      amount
      date_of_payment
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
      isActive
      feesRecords {
        id
        amount
        date_of_payment
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
      isActive
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

export const TOGGLE_ACTIVE_STATUS_MUTATION = gql`
  mutation ToggleStudentActive($id: ID!) {
    toggleStudentActive(id: $id) {
      id
      isActive
    }
  }
`;
