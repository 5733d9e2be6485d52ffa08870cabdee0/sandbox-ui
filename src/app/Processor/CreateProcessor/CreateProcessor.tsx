import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextInput,
  Tile,
} from '@patternfly/react-core';
import FiltersEdit, {
  EventFilter,
} from '@app/Processor/CreateProcessor/FiltersEdit/FiltersEdit';
import './CreateProcessor.css';

const CreateProcessor = () => {
  const [processorType, setProcessorType] = useState('');
  const [filters, setFilters] = useState<EventFilter[]>([
    { key: '', type: '', value: '' },
  ]);
  // const [transformation, setTransformation] = useState('');

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Create Processor</Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Form className={'processor-form'}>
          <FormSection title="General Information" titleElement="h2">
            <FormGroup
              label="Select processor type"
              fieldId={'processor-type'}
              isRequired
            >
              <Grid
                hasGutter={true}
                className={'processor-form__type-selection'}
              >
                <GridItem span={6}>
                  <Tile
                    title="Source Processor"
                    isSelected={processorType === 'source'}
                    style={{ height: '100%' }}
                    onClick={() => setProcessorType('source')}
                  >
                    Source processors are ready-to-use connectors that allow to
                    connect and stream data from external sources without having
                    to write any code.
                  </Tile>
                </GridItem>
                <GridItem span={6}>
                  <Tile
                    title="Sink Processor"
                    style={{ width: '100%', height: '100%' }}
                    isSelected={processorType === 'sink'}
                    onClick={() => setProcessorType('sink')}
                  >
                    Sink processors help connect events to actions.
                  </Tile>
                </GridItem>
              </Grid>
            </FormGroup>
            <FormGroup
              fieldId={'processor-name'}
              label="Processor name"
              isRequired={true}
            >
              <TextInput
                isRequired
                type="text"
                id="processor-name"
                name="processor-name"
                aria-describedby="processor-name"
                maxLength={255}
              />
            </FormGroup>
          </FormSection>
          <FormSection title="Filters" titleElement="h2">
            <FiltersEdit filters={filters} onChange={setFilters} />
          </FormSection>
          <FormSection title="Transformation"></FormSection>
          <FormSection title="Action"></FormSection>
        </Form>
      </PageSection>
    </>
  );
};

export default CreateProcessor;
