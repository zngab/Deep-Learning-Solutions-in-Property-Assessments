import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableElement from "./DraggableElement";
import { PropTypes } from "prop-types";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import ArgonBox from "components/ArgonBox";
import ArgonButton from "components/ArgonButton";
import { CleaningServices } from "../../../node_modules/@mui/icons-material/index";

const DragDropContextContainer = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: #f1f1f1;
`;

// const SourceColumn = styled.div`
//   grid-column: 1;
//   grid-row: 1 / 5;
// `;
const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(200px, auto);
`;

const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

const DragList = ({ onChildClick, initColumns, buttonName }) => {
  const [columns, setColumns] = useState(initColumns);
  const numLists = Object.keys(initColumns).length;

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const listCopy = { ...columns };
    const sourceList = listCopy[result.source.droppableId];
    const [removedElement, newSourceList] = removeFromList(sourceList, result.source.index);
    listCopy[result.source.droppableId] = newSourceList;

    const destinationList = listCopy[result.destination.droppableId];
    const rmvdElement = {
      ...removedElement,
      prefix: result.destination.droppableId,
    };
    listCopy[result.destination.droppableId] = addToList(
      destinationList,
      result.destination.index,
      rmvdElement
    );

    setColumns(listCopy);
  };

  const handleClick = (e) => {
    // e.preventDefault();
    onChildClick(columns);
  };
  return (
    <DragDropContextContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* <ListGrid> */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numLists}, 1fr)`,
            gridGap: "10px",
            gridAutoRows: "minmax(200px, auto)",
          }}
        >
          {Object.keys(columns).map((key) => {
            return <DraggableElement key={key} elements={columns[key]} prefix={key} />;
          })}
        </div>
        {/* </ListGrid> */}
        <ArgonBox m={3}>
          <Grid container justifyContent="center">
            <ArgonButton variant="gradient" color="primary" onClick={handleClick}>
              {buttonName}
            </ArgonButton>
          </Grid>
        </ArgonBox>
      </DragDropContext>
    </DragDropContextContainer>
  );
};

DragList.defaultProps = {
  initColumns: {},
  buttonName: "",
};

DragList.propTypes = {
  onChildClick: PropTypes.func,
  initColumns: PropTypes.object,
  buttonName: PropTypes.string,
};
export default DragList;
