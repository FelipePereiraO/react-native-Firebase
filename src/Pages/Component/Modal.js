import { AlertDialog, Button, NativeBaseProvider } from "native-base";
import React, { useEffect, useRef, useState } from "react";


export default function Modal({Text, onComfirm, onCancel}){
    const [isOpens, setIsOpen] = useState(true);
    const cancelRef = useRef(null);

    const onCloses = () => {
        setIsOpen(false);
        onCancel()
    } 

    return (
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpens} onClose={onCloses}>
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Aviso</AlertDialog.Header>
                <AlertDialog.Body>
                    {Text}
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button.Group space={2}>
                        <Button variant="unstyled" colorScheme="coolGray" onPress={onCloses} ref={cancelRef}>
                            Não
                        </Button>
                        <Button style={{ backgroundColor: '#2ecc71' }} onPress={onComfirm}>
                            Sim
                        </Button>
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    )
}