import React, { useRef, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import {
  Box,
  Column,
  Heading,
  Row,
  Stack,
  Text,
  Button,
  SelectList,
} from 'gestalt';
import 'gestalt/dist/gestalt.css';
const StoreDocumentAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
import StoreDocumentABI from "../Context/StoreDocument.json";
import { useRouter } from 'next/router'
import { create as ipfsHttpClient } from 'ipfs-http-client'
// const ipfsClient = require('ipfs-http-client');
const projectId = '2HOJiGDa1CaqLJEHkNgqe9smzxy';
const projectSecret = 'ef137d8ad1be6f6808d745feb6b32249';
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString(
  "base64"
)}`;
console.log(auth)

const subDomain = "https://tecblic-nft-marketplace.infura-ipfs.io";

  const client = ipfsHttpClient({
    host: "infura-ipfs.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,

    },

  });
  console.log(client)

export default function viewDoc() {
  const [instance, setInstance] = useState(null);
  const [dropPoint, setDropPoint] = useState(null);
  const viewer = useRef(null);
  const filePicker = useRef(null);
  const [assignees, setAssignees] = useState([]);
  const router = useRouter()
  const { tokenId } = router.query

  


  const uploadForSigning = async () => {
    const {docViewer, annotManager} = instance;
    const doc = docViewer.getDocument();

    const xfdfString = await annotManager.exportAnnotations({ widgets: true, fields: true });
    const data = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(data)
    console.log("array====>",arr);
    const blob = new Blob([arr], { type: 'application/pdf' });
    console.log(blob)
    const added = await client.add(blob)
    console.log(added)
    const url = `${subDomain}/ipfs/${added.path}`
    console.log(url)

  }


  

  useEffect(() => {
    /// loadWebViewer();
    tokenId && loadAssigners();
  }, [tokenId]);


  useEffect(() => {
    loadWebViewer();
  }, []);

  const loadWebViewer = async () => {
    const WebViewer = (await import('@pdftron/webviewer')).default;
    if (viewer.current) {
      WebViewer(
        {
          path: '/lib',
          initialDoc: `/lib/Prerequisite.pdf`,
          disabledElements: [
            'ribbons',
            'toggleNotesButton',
            'searchButton',
            'menuButton',
          ],
        },
        viewer.current
      ).then(instance => {
        const { iframeWindow } = instance;
        // select only the view group
        instance.setToolbarGroup('toolbarGroup-View');

        setInstance(instance);

        const iframeDoc = iframeWindow.document.body;
        iframeDoc.addEventListener('dragover', dragOver);
        iframeDoc.addEventListener('drop', e => {
          drop(e, instance);
        });

        filePicker.current.onchange = e => {
          const file = e.target.files[0];
          // console.log("test")
          console.log(file)
          if (file) {
            instance.loadDocument(file);
          }
        };
      })
    }
  };

  const applyFields = async () => {
    const { Annotations, docViewer } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const fieldManager = annotManager.getFieldManager();
    const annotationsList = annotManager.getAnnotationsList();
    const annotsToDelete = [];
    const annotsToDraw = [];

    await Promise.all(
      annotationsList.map(async (annot, index) => {
        let inputAnnot;
        let field;

        if (typeof annot.custom !== 'undefined') {
          // create a form field based on the type of annotation
          if (annot.custom.type === 'TEXT') {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: 'Tx',
                value: annot.custom.value,
              },
            );
            inputAnnot = new Annotations.TextWidgetAnnotation(field);
          } else if (annot.custom.type === 'SIGNATURE') {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: 'Sig',
              },
            );
            inputAnnot = new Annotations.SignatureWidgetAnnotation(field, {
              appearance: '_DEFAULT',
              appearances: {
                _DEFAULT: {
                  Normal: {
                    data:
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC',
                    offset: {
                      x: 100,
                      y: 100,
                    },
                  },
                },
              },
            });
          } else if (annot.custom.type === 'DATE') {
            field = new Annotations.Forms.Field(
              annot.getContents() + Date.now() + index,
              {
                type: 'Tx',
                value: 'm-d-yyyy',
                // Actions need to be added for DatePickerWidgetAnnotation to recognize this field.
                actions: {
                  F: [
                    {
                      name: 'JavaScript',
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                  K: [
                    {
                      name: 'JavaScript',
                      // You can customize the date format here between the two double-quotation marks
                      // or leave this blank to use the default format
                      javascript: 'AFDate_FormatEx("mmm d, yyyy");',
                    },
                  ],
                },
              },
            );

            inputAnnot = new Annotations.DatePickerWidgetAnnotation(field);
          } else {
            // exit early for other annotations
            annotManager.deleteAnnotation(annot, false, true); // prevent duplicates when importing xfdf
            return;
          }
        } else {
          // exit early for other annotations
          return;
        }

        // set position
        inputAnnot.PageNumber = annot.getPageNumber();
        inputAnnot.X = annot.getX();
        inputAnnot.Y = annot.getY();
        inputAnnot.rotation = annot.Rotation;
        if (annot.Rotation === 0 || annot.Rotation === 180) {
          inputAnnot.Width = annot.getWidth();
          inputAnnot.Height = annot.getHeight();
        } else {
          inputAnnot.Width = annot.getHeight();
          inputAnnot.Height = annot.getWidth();
        }

        // delete original annotation
        annotsToDelete.push(annot);

        // customize styles of the form field
        Annotations.WidgetAnnotation.getCustomStyles = function (widget) {
          if (widget instanceof Annotations.SignatureWidgetAnnotation) {
            return {
              border: '1px solid #a5c7ff',
            };
          }
        };
        Annotations.WidgetAnnotation.getCustomStyles(inputAnnot);

        // draw the annotation the viewer
        annotManager.addAnnotation(inputAnnot);
        fieldManager.addField(field);
        annotsToDraw.push(inputAnnot);
      }),
    );

    // delete old annotations
    annotManager.deleteAnnotations(annotsToDelete, null, true);

    // refresh viewer
    await annotManager.drawAnnotationsFromList(annotsToDraw);
    await uploadForSigning();
  };



  const addField = (type, point = {}, name = '', value = '', flag = {}) => {
    const { docViewer, Annotations } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const doc = docViewer.getDocument();
    const displayMode = docViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    const page_idx =
      page.first !== null ? page.first : docViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = docViewer.getZoom();

    var textAnnot = new Annotations.FreeTextAnnotation();
    textAnnot.PageNumber = page_idx;
    const rotation = docViewer.getCompleteRotation(page_idx) * 90;
    textAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 50.0 / zoom;
      textAnnot.Height = 250.0 / zoom;
    } else {
      textAnnot.Width = 250.0 / zoom;
      textAnnot.Height = 50.0 / zoom;
    }
    textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.custom = {
      type,
      value,
      flag,
      name: `${""}_${type}_`,
    };

    // set the type of annot
    textAnnot.setContents(textAnnot.custom.name);
    textAnnot.FontSize = '' + 20.0 / zoom + 'px';
    textAnnot.FillColor = new Annotations.Color(211, 211, 211, 0.5);
    textAnnot.TextColor = new Annotations.Color(0, 165, 228);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
    textAnnot.TextAlign = 'center';

    textAnnot.Author = annotManager.getCurrentUser();

    annotManager.deselectAllAnnotations();
    annotManager.addAnnotation(textAnnot, true);
    annotManager.redrawAnnotation(textAnnot);
    annotManager.selectAnnotation(textAnnot);
  };



  const dragOver = e => {
    e.preventDefault();
    return false;
  };

  const drop = (e, instance) => {
    const { docViewer } = instance;
    const scrollElement = docViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;
    setDropPoint({ x: e.pageX + scrollLeft, y: e.pageY + scrollTop });
    e.preventDefault();
    return false;
  };

  const dragStart = e => {
    e.target.style.opacity = 0.5;
    const copy = e.target.cloneNode(true);
    copy.id = 'form-build-drag-image-copy';
    copy.style.width = '250px';
    document.body.appendChild(copy);
    e.dataTransfer.setDragImage(copy, 125, 25);
    e.dataTransfer.setData('text', '');
  };

  const dragEnd = (e, type) => {
    addField(type, dropPoint);
    e.target.style.opacity = 1;
    document.body.removeChild(
      document.getElementById('form-build-drag-image-copy'),
    );
    e.preventDefault();
  };

  async function loadAssigners() {
    const web3Modal = new Web3Modal(

    )
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    if (typeof window.ethereum !== 'undefined') {
      // await requestAccount();
    }
    let contract = new ethers.Contract(StoreDocumentAddress, StoreDocumentABI.abi, signer)
    const data = await contract.Users();
    const { tokenId } = router.query




    const items = await Promise.all(data.map(async i => {
      let item = {

        tokenId: i.id.toString(),
        Name: i.name,
        Email: i.email
      }
      // var select = document.getElementById("assigningFor"),
      // arr = i.id.toString();

      // for (var j = 0; j < arr.length; j++) {
      //   var option = document.createElement("OPTION"),
      //   txt = document.createTextNode(i.name);
      //   option.appendChild(txt);
      //   option.setAttribute("value", i.name);
      //   select.insertBefore(option, select.lastChild);
      // }
      return item

    }))

    // console.log(items)
    // console.log("------------------", items.filter(el => el.tokenId == tokenId && el)[0]?.Email)

    setAssignees(items)

    const tmp = items.filter(el => tokenId && el.tokenId == tokenId)
    // return(account)

  }



  return (
    <div className="">
      <Box display="flex" direction="row" flex="grow">
        <Column span={2}>
          <Box padding={3}>
            <Heading size="md">Prepare Document</Heading>
          </Box>
          <Box padding={3}>
            <Box padding={2}>
              <Text>{'Step 1'}</Text>
            </Box>
            <Box padding={2}>
              <Button
                onClick={() => {
                  if (filePicker) {
                    filePicker.current.click();
                  }
                }}
                accessibilityLabel="upload a document"
                text="Upload a document"
                iconEnd="add-circle"
              />
            </Box>
            <Box padding={2}>
              <Text>{'Step 2'}</Text>
            </Box>

            <Box padding={2}>
              {/* <SelectList
                id="assigningFor"
                name="assign"
                // onChange={({ value }) => setAssignee(value)}
                // options={assigneesValues}
                placeholder="Select recipient"
                label="Adding signature for"
              // value={assignee}
              /> */}
              <select id="assigningFor"
              >
                <option value="default"> DEFAULT </option>
                {assignees && assignees.map((el) => (
                  <option key={el.id} selected={tokenId === el.tokenId} value="default"> {el.Name} </option>
                ))}
              </select>
              {/* {assignees.map((user, i) => (
                  <SelectList
                  id="assigningFor"
                  name="assign"
                  onChange ={({ value }) => setAssignee(value)}
                  options={user.Name}
                  placeholder="Select recipient"
                  label="Adding signature for"
                value={assignees}
                />
                  //  <div>{`${user.Name.toString()}`}</div>
                ))} */}
            </Box>
            <Box padding={2}>
              <div
                draggable
                onDragStart={e => dragStart(e)}
                onDragEnd={e => dragEnd(e, 'SIGNATURE')}
              >
                <Button
                  onClick={() => addField(assignees.filter(el => el.tokenId == tokenId && el)[0]?.Email)}
                  accessibilityLabel="add signature"
                  text="Add signature"
                  iconEnd="compose"
                />
              </div>
            </Box>
            <Box padding={2}>
              <div
                draggable
                onDragStart={e => dragStart(e)}
                onDragEnd={e => dragEnd(e, 'TEXT')}
              >
                <Button
                  onClick={() => addField('TEXT')}
                  accessibilityLabel="add text"
                  text="Add text"
                  iconEnd="text-sentence-case"
                />
              </div>
            </Box>
            <Box padding={2}>
              <div
                draggable
                onDragStart={e => dragStart(e)}
                onDragEnd={e => dragEnd(e, 'DATE')}
              >
                <Button
                  onClick={() => addField('DATE')}
                  accessibilityLabel="add date field"
                  text="Add date"
                  iconEnd="calendar"
                />
              </div>
            </Box>

            <Box padding={2}>
              <Text>{'Step 3'}</Text>
            </Box>
            <Box padding={2}>
              <Button
                onClick={applyFields}
                accessibilityLabel="Send for signing"
                text="Send"
                iconEnd="send"
              />
            </Box>
          </Box>
        </Column>
        <Column span={10}>
          <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
        </Column>

      </Box>
      <input type="file" ref={filePicker} style={{ display: 'none' }} />
    </div>
  );
}
